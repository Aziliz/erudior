package com.erudior.updates;

public final class NativeLifecycleStateTest {
    private static void check(boolean ok, String name) { if (!ok) throw new AssertionError(name); }
    public static void main(String[] args) {
        NativeLifecycleState state = new NativeLifecycleState();
        check(state.pending(), "startup awaits a real consumer");
        state.pause(1_000L); // Lost pause delivery does not lose the native clock.
        state.pause(2_000L);
        state.resume(31_000L);
        long first = state.revocation();
        check(first > 0L && state.backgroundMs() == 30_000L, "repeated pause preserves first timestamp");
        long staleSequence = state.sequence();
        state.resume(31_100L); // Missing first resume ACK, followed by zero-duration resume.
        check(state.revocation() == first && state.backgroundMs() == 0L, "zero resume retains revocation");
        check(!state.acknowledge(staleSequence, first), "stale ACK cannot consume later state");
        check(!state.acknowledge(state.sequence(), 0L), "wrong obligation cannot ACK");
        check(state.pending(), "absent listener/lost delivery remains pending");
        state.replayForNewWebView();
        check(state.pending() && state.revocation() == first, "new WebView replay retains debt");
        check(state.acknowledge(state.sequence(), first), "matching replay ACK consumes debt");
        check(!state.pending() && state.revocation() == 0L, "ACK does not create a role or grant");
        state.pause(40_000L); state.resume(70_001L);
        long second = state.revocation();
        check(second > first, "new long absence advances obligation after authentication");
        staleSequence = state.sequence();
        state.pause(71_000L);
        check(state.paused() && state.pending(), "new pause conceals despite old unacknowledged resume");
        check(!state.acknowledge(staleSequence, second), "old resume ACK cannot reveal new pause");
        state.resume(71_500L);
        check(state.revocation() == second, "short resume retains older owed revocation");
        state.pause(72_000L); state.resume(102_000L);
        check(state.revocation() > second, "new qualifying absence advances even with older ACK lost");
        check(state.acknowledge(state.sequence(), state.revocation()), "latest ACK accepted");
        state.pause(200_000L); state.resume(200_100L);
        check(state.revocation() == 0L && state.backgroundMs() == 100L, "short absence creates no authority and no revocation");
        System.out.println("Native lifecycle reducer: dropped delivery, replay, sticky/new obligations and stale ACK passed");
        missingPauseRequiresRevocation();
        unknownResumeCannotEraseDebt();
        measuredGraceBoundariesRemainUnchanged();
        backwardsClockRequiresRevocation();
        System.out.println("Native lifecycle reducer: missing pause, replay, stale ACK, grace boundaries and invalid clock regression groups passed");
    }

    private static void consume(NativeLifecycleState state) {
        check(state.acknowledge(state.sequence(), state.revocation()), "current state consumed");
    }

    private static void missingPauseRequiresRevocation() {
        NativeLifecycleState state = new NativeLifecycleState();
        state.replayForNewWebView();
        consume(state); // The original cold-start delivery has already been consumed.
        long before = state.sequence();
        state.resume(42_000L); // Android returns, but no pause timestamp was recorded.
        check(state.revocation() > 0L, "an unpaired resume must revoke rather than trust zero elapsed time");
        check(state.revocation() == state.sequence() && state.sequence() > before, "unknown absence is a new revocation");
        check(state.backgroundMs() == 0L, "do not fabricate a measured thirty-second duration");
        check(state.pending() && !state.paused(), "foreground stays pending until consumer commit");
        check(!state.acknowledge(before, 0L), "startup ACK cannot reveal unknown return");
        check(!state.acknowledge(state.sequence(), 0L), "new return requires its actual revocation token");
        long owed = state.revocation();
        state.replayForNewWebView();
        check(state.revocation() == owed && state.pending(), "reload preserves unknown-absence debt");
        consume(state);
        check(!state.pending() && state.revocation() == 0L, "exact consumer ACK clears delivery debt only");
        state.resume(42_500L);
        check(state.revocation() > owed, "another unpaired return after ACK requires fresh revocation");
    }

    private static void unknownResumeCannotEraseDebt() {
        NativeLifecycleState state = new NativeLifecycleState();
        state.resume(1_000L);
        long owed = state.revocation();
        long oldSequence = state.sequence();
        check(owed > 0L, "first unobserved resume is conservative even before a family is selected");
        state.resume(1_001L);
        check(state.revocation() == owed, "duplicate while pending preserves the same owed revocation");
        check(!state.acknowledge(oldSequence, owed), "duplicate invalidates older sequence ACK");
        state.pause(2_000L);
        consume(state); // A real pause consumer has synchronously concealed/revoked.
        state.resume(2_100L);
        check(state.backgroundMs() == 100L && state.revocation() == 0L, "genuinely observed short absence stays short");
        consume(state);
        state.resume(2_101L);
        check(state.revocation() > owed, "unpaired resume after measured short return is not silently trusted");
    }

    private static void measuredGraceBoundariesRemainUnchanged() {
        for (long duration : new long[] { 0L, 1L, 29_999L, 30_000L, 30_001L, 60_000L }) {
            NativeLifecycleState state = new NativeLifecycleState();
            consume(state);
            state.pause(100_000L);
            state.resume(100_000L + duration);
            check(state.backgroundMs() == duration, "measured duration preserved: " + duration);
            check((state.revocation() > 0L) == (duration >= NativeLifecycleState.GRACE_MS), "grace threshold unchanged: " + duration);
            consume(state);
            check(!state.pending(), "measured state can be consumed: " + duration);
        }
    }

    private static void backwardsClockRequiresRevocation() {
        NativeLifecycleState state = new NativeLifecycleState();
        consume(state);
        state.pause(5_000L);
        state.resume(4_999L);
        check(state.revocation() > 0L, "an invalid monotonic interval must not count as a known short absence");
        check(state.backgroundMs() == 0L && state.pending(), "invalid interval is not invented elapsed time");
        consume(state);
        state.pause(8_000L); state.resume(8_001L);
        check(state.backgroundMs() == 1L && state.revocation() == 0L, "subsequent valid pair restores ordinary grace behavior");
    }
}

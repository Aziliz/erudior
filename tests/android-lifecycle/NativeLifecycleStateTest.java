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
    }
}

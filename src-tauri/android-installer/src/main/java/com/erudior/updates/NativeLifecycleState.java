package com.erudior.updates;

/** UI-thread-owned, memory-only delivery state. Never grants learner access. */
public final class NativeLifecycleState {
    public static final long GRACE_MS = 30_000L;
    private long sequence = 1L;
    private long acknowledged = 0L;
    private long backgroundAt = -1L;
    private long backgroundMs = 0L;
    private long revocation = 0L;
    private boolean paused = false;

    public long sequence() { return sequence; }
    public long backgroundMs() { return backgroundMs; }
    public long revocation() { return revocation; }
    public boolean paused() { return paused; }
    public boolean pending() { return acknowledged != sequence; }

    public void pause(long now) {
        if (backgroundAt < 0L) backgroundAt = now;
        paused = true;
        backgroundMs = 0L;
        sequence++;
    }

    public void resume(long now) {
        // A missing pause callback (or invalid monotonic interval) is not evidence
        // of a short absence. Keep the measured duration honest and separately
        // require the JS consumer to revoke before the native paint fence opens.
        boolean unknownAbsence = backgroundAt < 0L || now < backgroundAt;
        backgroundMs = unknownAbsence ? 0L : now - backgroundAt;
        backgroundAt = -1L;
        paused = false;
        sequence++;
        // A new qualifying absence is a new obligation, even if an older ACK was lost.
        // Short/duplicate resumes never erase an unconsumed obligation.
        if (backgroundMs >= GRACE_MS || (unknownAbsence && revocation == 0L)) {
            revocation = sequence;
        }
    }

    public void replayForNewWebView() {
        sequence++;
        if (backgroundMs >= GRACE_MS) revocation = sequence;
    }

    public boolean acknowledge(long deliveredSequence, long deliveredRevocation) {
        if (deliveredSequence != sequence || deliveredRevocation != revocation) return false;
        acknowledged = sequence;
        revocation = 0L;
        return true;
    }
}

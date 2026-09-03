import { MetricRow } from '../site/MetricDisplay'
import { formatCount } from '@/lib/field-data/format'
import type { FieldAccuracy } from '@/lib/field-data/types'

/**
 * Accuracy is only ever shown with the sample it came from.
 *
 * With no validated observations the percentage is not 0% and it is not 100% —
 * it does not exist, and the panel says so instead of printing a number.
 */
export default function AccuracyPanel({ accuracy }: { accuracy: FieldAccuracy }) {
  const hasObservations = accuracy.validatedObservations > 0

  return (
    <div>
      <MetricRow
        size="sm"
        columns={4}
        metrics={[
          {
            label: 'Check-ins',
            value: formatCount(accuracy.checkIns),
            note: 'On-site verification visits',
          },
          {
            label: 'Validated observations',
            value: formatCount(accuracy.validatedObservations),
            note: 'One per space, per check-in',
          },
          {
            label: 'Matches',
            value: formatCount(accuracy.matches),
            note: 'System agreed with the observer',
          },
          {
            label: 'Mismatches',
            value: formatCount(accuracy.mismatches),
            note: 'System disagreed with the observer',
          },
        ]}
      />

      <div className="mt-10 border-t border-line pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Observed detection accuracy
        </p>
        {hasObservations ? (
          <>
            <p
              data-numeric
              className="mt-2 text-[40px] font-semibold tracking-[-0.02em] text-ink md:text-[48px]"
            >
              {accuracy.accuracyPercent!.toFixed(1)}%
            </p>
            <p className="mt-2 text-[15px] text-muted" data-numeric>
              {formatCount(accuracy.matches)} of{' '}
              {formatCount(accuracy.validatedObservations)} validated observations
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-[24px] font-semibold tracking-[-0.01em] text-ink md:text-[28px]">
              No validated observations yet
            </p>
            <p className="measure mt-3 text-[15px] leading-relaxed text-muted">
              The deployment is new. Until on-site check-ins have been recorded there is
              no sample to divide by, so there is no accuracy figure to publish. It will
              appear here with its denominator once one exists.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

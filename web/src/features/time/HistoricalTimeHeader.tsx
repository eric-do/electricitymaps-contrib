import Badge from 'components/Badge';
import { Button } from 'components/Button';
import { FormattedTime } from 'components/Time';
import { useAtomValue } from 'jotai';
import { ArrowRightToLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { RouteParameters } from 'types';
import { useNavigateWithParameters } from 'utils/helpers';
import { endDatetimeAtom, isHourlyAtom, startDatetimeAtom } from 'utils/state/atoms';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function HistoricalTimeHeader() {
  const { i18n } = useTranslation();
  const startDatetime = useAtomValue(startDatetimeAtom);
  const endDatetime = useAtomValue(endDatetimeAtom);
  const isHourly = useAtomValue(isHourlyAtom);
  const { urlDatetime } = useParams<RouteParameters>();
  const navigate = useNavigateWithParameters();

  function handleRightClick() {
    if (!endDatetime || !urlDatetime) {
      return;
    }
    const currentEndDatetime = new Date(endDatetime);
    const newDate = new Date(currentEndDatetime.getTime() + TWENTY_FOUR_HOURS);

    const twentyFourHoursAgo = new Date(Date.now() - TWENTY_FOUR_HOURS);
    if (newDate >= twentyFourHoursAgo) {
      navigate({ datetime: '' });
      return;
    }
    navigate({ datetime: newDate.toISOString() });
  }

  function handleLeftClick() {
    if (!endDatetime) {
      return;
    }
    const currentEndDatetime = new Date(endDatetime);
    const newDate = new Date(currentEndDatetime.getTime() - TWENTY_FOUR_HOURS);
    navigate({ datetime: newDate.toISOString() });
  }

  return (
    <div className="flex min-h-6 flex-row items-center justify-between">
      {startDatetime && endDatetime && (
        <Badge
          pillText={
            <FormattedTime
              datetime={startDatetime}
              language={i18n.languages[0]}
              endDatetime={endDatetime}
            />
          }
          type="success"
        />
      )}
      {isHourly && (
        <div className="flex h-6 flex-row items-center gap-x-3">
          <Button
            backgroundClasses="bg-transparent"
            onClick={handleLeftClick}
            size="sm"
            type="tertiary"
            icon={
              <ChevronLeft
                size={22}
                className={twMerge('text-brand-green', !isHourly && 'opacity-50')}
              />
            }
          />
          <Button
            backgroundClasses="bg-transparent"
            size="sm"
            onClick={handleRightClick}
            type="tertiary"
            isDisabled={!urlDatetime}
            icon={
              <ChevronRight
                className={twMerge(
                  'text-brand-green',
                  (!urlDatetime || !isHourly) && 'opacity-50'
                )}
                size={22}
              />
            }
          />
          <Button
            size="sm"
            type="tertiary"
            onClick={() => navigate({ datetime: '' })}
            isDisabled={!urlDatetime}
            icon={
              <ArrowRightToLine
                className={twMerge(
                  'text-brand-green',
                  (!urlDatetime || !isHourly) && 'opacity-50'
                )}
                size={22}
              />
            }
          />
        </div>
      )}
    </div>
  );
}

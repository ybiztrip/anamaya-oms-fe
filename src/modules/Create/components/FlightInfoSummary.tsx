import { ArrowRightOutlined } from '@ant-design/icons';

import useFlightAirlines from '@/hooks/useFlightAirlines';
import type { FlightSearchOneWayType } from '@/types';

function FlightInfoSummary({ flight }: { flight: FlightSearchOneWayType }) {
  const { airlinesByCode } = useFlightAirlines();

  const journey = flight?.journeys?.[0];
  const seg0 = journey?.segments?.[0];

  const airlineCode = seg0?.marketingAirline;
  const airline = airlineCode ? (airlinesByCode as any)[airlineCode] : undefined;

  const dep = journey?.departureDetail;
  const arr = journey?.arrivalDetail;

  const depTerminal = dep?.departureTerminal ? `T${dep.departureTerminal}` : '-';
  const arrTerminal = arr?.arrivalTerminal ? `T${arr.arrivalTerminal}` : '-';

  return (
    <div>
      <div className="flex items-center gap-3">
        {airline?.logoUrl ? (
          <img
            src={airline.logoUrl}
            alt={airline.airlineName ?? airlineCode}
            style={{ height: 24 }}
          />
        ) : (
          <div style={{ width: 24, height: 24 }} />
        )}
        <div>
          <div className="text-sm font-medium">
            {airline?.airlineName ?? airlineCode ?? 'Unknown airline'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-semibold">{dep?.departureTime ?? '-'}</div>
            <div className="text-xs">
              {dep?.airportCode ?? '-'} {depTerminal}
            </div>
          </div>

          <div className="text-center">
            <ArrowRightOutlined />
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">{arr?.arrivalTime ?? '-'}</div>
            <div className="text-xs">
              {arr?.airportCode ?? '-'} {arrTerminal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightInfoSummary;

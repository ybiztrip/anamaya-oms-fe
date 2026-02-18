import { Button, Card, Col, Row } from 'antd';

import useFlightAirlines from '@/hooks/useFlightAirlines';
import type { FlightSearchOneWayType } from '@/types';
import { formatDuration, formatIDR } from '@/utils/formatter';

function FlightInfo({
  flight,
  withSelect = true,
  onSelect,
}: {
  flight: FlightSearchOneWayType;
  withSelect?: boolean;
  onSelect?: (flight: FlightSearchOneWayType) => void;
}) {
  const { airlinesByCode } = useFlightAirlines();

  const journey = flight?.journeys?.[0];
  const seg0 = journey?.segments?.[0];

  const airlineCode = seg0?.marketingAirline;
  const airline = airlineCode ? (airlinesByCode as any)[airlineCode] : undefined;

  const dep = journey?.departureDetail;
  const arr = journey?.arrivalDetail;

  const total =
    journey?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency ??
    journey?.fareInfo?.airlineFare?.adultFare?.totalFareWithCurrency;

  const depTerminal = dep?.departureTerminal ? `T${dep.departureTerminal}` : '-';
  const arrTerminal = arr?.arrivalTerminal ? `T${arr.arrivalTerminal}` : '-';

  return (
    <Card key={flight.flightId} size="small">
      <Row align="middle" gutter={16} wrap={false}>
        <Col flex="220px">
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
              <div className="font-medium">
                {airline?.airlineName ?? airlineCode ?? 'Unknown airline'}
              </div>
              <div className="text-xs text-gray-500">{seg0?.flightCode}</div>
            </div>
          </div>
          {/* TODO: add flight add-ons */}
        </Col>

        <Col flex="auto">
          <div className="grid grid-cols-[4rem_auto_4rem] items-center justify-stretch">
            <div>
              <div className="text-lg font-semibold">{dep?.departureTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {dep?.airportCode ?? '-'} {depTerminal}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm">{formatDuration(journey?.journeyDuration)}</div>
              <div className="border-t-4 border-gray-200 my-2" />
              <div className="text-xs text-gray-500">
                {flight?.numOfTransits === '0' ? 'Nonstop' : `${flight?.numOfTransits} transit`}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">{arr?.arrivalTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {arr?.airportCode ?? '-'} {arrTerminal}
              </div>
            </div>
          </div>
        </Col>

        <Col flex="220px" className="text-right">
          <div className="text-lg font-semibold">
            {total?.currency ?? 'IDR'} {formatIDR(total?.amount)}
          </div>
        </Col>
        {withSelect && (
          <Col flex="220px" className="text-right">
            <Button type="primary" className="mt-2" onClick={() => onSelect?.(flight)}>
              Select
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
}
export default FlightInfo;

import { ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Popover, Row, Tag, Timeline } from 'antd';
import { Utensils } from 'lucide-react';
import { useMemo } from 'react';

import useFlightAirlines from '@/hooks/useFlightAirlines';
import useFlightAirport from '@/hooks/useFlightAirport';
import type {
  AddOnBaggageType,
  FlightJourneySegmentType,
  FlightJourneyType,
  FlightSearchOneWayType,
} from '@/types';
import { formatDuration, formatIDR } from '@/utils/formatter';

function groupSegmentsByConsecutiveAirline(segments: FlightJourneySegmentType[] | undefined) {
  const list = segments ?? [];
  const groups: { airlineCode: string; segments: FlightJourneySegmentType[] }[] = [];
  for (const seg of list) {
    const code = seg?.marketingAirline ?? '';
    const last = groups.at(-1);
    if (last && last.airlineCode === code) {
      last.segments.push(seg);
    } else {
      groups.push({ airlineCode: code, segments: [seg] });
    }
  }
  return groups;
}

function formatBaggageText(baggage: AddOnBaggageType | undefined) {
  if (baggage == null) return '';

  const baggageWeight = baggage.baggageWeight;
  const quantity = Number(baggage.baggageQuantity ?? 0);
  if (baggage.baggageType === 'PIECE') {
    return `${quantity} PIECE`;
  }

  return `${baggageWeight} KG`;
}

const getHasMealAddOn = (segment: FlightJourneySegmentType) => {
  const mealOptions = segment?.addOns?.mealOptions ?? [];
  const firstNetAmount = Number(mealOptions[0]?.netToAgent?.amount);
  return mealOptions.length > 0 && firstNetAmount === 0;
};

function FlightInfo({
  flight,
  withFlightClass = true,
  withAddOnsBaggage = true,
  withAddOnsMeal = true,
  withPrice = true,
  withSelect = true,
  onSelect,
}: Readonly<{
  flight: FlightSearchOneWayType;
  withFlightClass?: boolean;
  withAddOnsBaggage?: boolean;
  withAddOnsMeal?: boolean;
  withPrice?: boolean;
  withSelect?: boolean;
  onSelect?: (flight: FlightSearchOneWayType) => void;
}>) {
  const { airlinesByCode } = useFlightAirlines();
  const { airportsByCode } = useFlightAirport();

  const journeys = useMemo(() => flight.journeys ?? [], [flight.journeys]);
  const firstJourney = journeys[0];
  const lastJourney = journeys.at(-1);

  const allSegments = useMemo(() => journeys.flatMap((j) => j?.segments ?? []), [journeys]);

  const groupedAirlines = useMemo(
    () => groupSegmentsByConsecutiveAirline(allSegments),
    [allSegments],
  );

  const groupedAirlinesWithAddOns = useMemo(
    () =>
      groupedAirlines.map((group) => {
        const uniqueAddOnsMap = new Map<string, { baggageText: string; hasMealAddOn: boolean }>();

        group.segments.forEach((segment) => {
          const baggageText = formatBaggageText(segment?.addOns?.baggageOptions?.[0]);
          const hasMealAddOn = getHasMealAddOn(segment);
          const signature = JSON.stringify({ baggageText, hasMealAddOn });

          if (!uniqueAddOnsMap.has(signature) && (baggageText || hasMealAddOn)) {
            uniqueAddOnsMap.set(signature, { baggageText, hasMealAddOn });
          }
        });

        return {
          ...group,
          uniqueAddOns: Array.from(uniqueAddOnsMap.values()),
        };
      }),
    [groupedAirlines],
  );

  const flightClass = firstJourney?.segments?.[0]?.seatClass ?? '';

  const refundableStatus = String(firstJourney?.refundableStatus ?? '').toUpperCase();
  const isRefundable = refundableStatus === 'REFUNDABLE';

  const dep = firstJourney?.departureDetail;
  const arr = lastJourney?.arrivalDetail;

  const totalPrice =
    journeys?.reduce((acc: number, journey: FlightJourneyType) => {
      return (
        acc + Number(journey?.fareInfo?.partnerFare?.adultFare?.totalFareWithCurrency?.amount ?? 0)
      );
    }, 0) ?? 0;

  const depTerminal = dep?.departureTerminal ? `T${dep.departureTerminal}` : '-';
  const arrTerminal = arr?.arrivalTerminal ? `T${arr.arrivalTerminal}` : '-';

  const transitLabel =
    flight?.numOfTransits === '0' ? 'Nonstop' : `${flight?.numOfTransits} transit`;

  const segmentTimelineItems = useMemo(
    () =>
      allSegments.flatMap((seg) => {
        const d = seg?.departureDetail;
        const a = seg?.arrivalDetail;
        const depT = d?.departureTerminal ? `T${d.departureTerminal}` : '';
        const arrT = a?.arrivalTerminal ? `T${a.arrivalTerminal}` : '';
        const code = seg?.marketingAirline;
        const airline = code ? airlinesByCode[code] : undefined;

        return [
          ...(seg?.transitDurationInMinutes
            ? [
                {
                  color: 'gray',
                  title: (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDuration(seg.transitDurationInMinutes)}
                    </div>
                  ),
                  content: <div className="text-medium">Transit </div>,
                },
              ]
            : []),
          {
            color: 'blue',
            title: `Departure: ${d?.departureTime}`,
            content: (
              <div>
                <div className="font-medium">
                  {airportsByCode[d?.airportCode]?.localAirportName ?? '-'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {d?.airportCode ?? '-'} · {depT ? ` ${depT}` : ''}
                </div>
              </div>
            ),
          },
          {
            color: 'green',
            title: (
              <div className="text-xs text-gray-500 mt-1">
                {formatDuration(seg.flightDurationInMinutes)}
              </div>
            ),
            content: (
              <div className="text-medium">
                {airline?.airlineName ?? code} ·{' '}
                <span className="text-xs text-gray-500">{seg?.flightCode}</span>
              </div>
            ),
          },
          {
            color: 'blue',
            title: `Arrival: ${a?.arrivalTime}`,
            content: (
              <div>
                <div className="font-medium">
                  {airportsByCode[a?.airportCode]?.localAirportName ?? '-'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {a?.airportCode ?? '-'} · {arrT ? ` ${arrT}` : ''}
                </div>
              </div>
            ),
          },
        ];
      }),
    [allSegments, airlinesByCode, airportsByCode],
  );

  const segmentPopoverContent = (
    <div style={{ maxWidth: 360 }}>
      <Timeline items={segmentTimelineItems} />
    </div>
  );

  return (
    <Card key={flight.flightId} size="small">
      <Row align="middle" gutter={16} wrap={false}>
        <Col flex="220px">
          <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-3 items-center">
            {groupedAirlines.map((g, i) => {
              const airline = g.airlineCode ? airlinesByCode[g.airlineCode] : undefined;
              return (
                <div key={`${g.airlineCode}-${i}`} className="contents">
                  <div className="flex items-center justify-center">
                    {airline?.logoUrl ? (
                      <img
                        src={airline.logoUrl}
                        alt={airline.airlineName ?? g.airlineCode}
                        style={{ height: 24, width: 48, objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 24 }} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {airline?.airlineName ?? g.airlineCode ?? 'Unknown airline'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {g.segments
                        .map((s) => s.flightCode)
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    {withFlightClass && (
                      <div className="mt-1 text-xs text-gray-500">{flightClass}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Col>

        <Col flex="auto" className="text-center">
          {(withAddOnsBaggage || withAddOnsMeal) &&
            groupedAirlinesWithAddOns.map((g, i) => {
              const airline = g.airlineCode ? airlinesByCode[g.airlineCode] : undefined;
              return (
                <div
                  key={`add-ons-${g.airlineCode}-${i}`}
                  className="flex items-center justify-center gap-x-1 mb-1"
                >
                  <Tag color="default" className="m-0 shrink-0">
                    <div className="flex items-center justify-center gap-x-1">
                      {airline?.logoUrl && groupedAirlinesWithAddOns.length > 1 && (
                        <img
                          src={airline.logoUrl}
                          alt={airline.airlineName ?? g.airlineCode}
                          style={{ height: 12, objectFit: 'contain' }}
                        />
                      )}

                      <div className="inline-flex items-center gap-x-1">
                        {g.uniqueAddOns.map((addOn, addOnIndex) => (
                          <span
                            key={`${g.airlineCode}-${i}-add-on-${addOnIndex}`}
                            className="inline-flex items-center gap-x-3"
                          >
                            {addOnIndex > 0 && <span>·</span>}
                            {addOn.baggageText && withAddOnsBaggage && (
                              <span>
                                <ShoppingOutlined className="mr-1" />
                                {addOn.baggageText}
                              </span>
                            )}
                            {addOn.hasMealAddOn && withAddOnsMeal && <Utensils size={12} />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Tag>
                </div>
              );
            })}
          <Tag color={isRefundable ? 'green' : 'red'} className="m-0 shrink-0">
            {isRefundable ? 'Refundable' : 'Non-refundable'}
          </Tag>
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
              <div className="text-sm">{formatDuration(String(flight?.tripDuration))}</div>
              <div className="border-t-4 border-gray-200 my-2" />
              <div className="text-xs text-gray-500">
                <Popover content={segmentPopoverContent} trigger="hover" placement="top">
                  <span className="cursor-default border-b border-dotted border-gray-400">
                    {transitLabel}
                  </span>
                </Popover>
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

        {withPrice && (
          <Col flex="auto" className="text-center">
            <div className="text-lg font-semibold mr-4">
              {'IDR'} {formatIDR(totalPrice)}
            </div>
          </Col>
        )}
        {withSelect && (
          <Col
            flex="100px"
            className="text-right self-stretch sticky right-0 bg-white flex items-center justify-end"
          >
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

/**
 * Minimal taxi-dispatch ride state machine.
 * Educational example, NOT an official Hoppvia API or SDK.
 * Real systems need authorization, persistence, deduplication and locks.
 */
export const RideStatus=Object.freeze({
  REQUESTED:"requested",ACCEPTED:"accepted",ARRIVING:"arriving",
  IN_PROGRESS:"in_progress",COMPLETED:"completed",CANCELLED:"cancelled"
});
const transitions=Object.freeze({
  requested:["accepted","cancelled"],
  accepted:["arriving","cancelled"],
  arriving:["in_progress","cancelled"],
  in_progress:["completed"],
  completed:[],cancelled:[]
});
export class InvalidRideTransition extends Error {
  constructor(from,to){super(`Cannot transition ride from ${from} to ${to}`);this.name="InvalidRideTransition";}
}
/** Pure transition function; persistence and authorization happen in the caller. */
export function transitionRide(ride,nextStatus,event){
  if(!ride?.id || !Object.hasOwn(transitions,ride.status)) throw new TypeError("Invalid ride");
  if(!event?.actorId || typeof event.actorId!=="string") throw new TypeError("actorId required");
  if(!Object.hasOwn(transitions,nextStatus)) throw new TypeError("Unknown destination status");
  if(!transitions[ride.status].includes(nextStatus)) throw new InvalidRideTransition(ride.status,nextStatus);
  const at=event.at ?? new Date().toISOString();
  if(Number.isNaN(Date.parse(at))) throw new TypeError("Invalid timestamp");
  const version=Number.isSafeInteger(ride.version)&&ride.version>=0?ride.version:0;
  return {
    ...ride,status:nextStatus,version:version+1,updatedAt:at,
    history:[...(ride.history??[]),{
      type:"ride.status.changed",from:ride.status,to:nextStatus,
      actorId:event.actorId,at,...(event.eventId?{eventId:event.eventId}:{})
    }]
  };
}

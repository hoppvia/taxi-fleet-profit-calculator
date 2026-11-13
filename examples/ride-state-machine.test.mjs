import test from "node:test";
import assert from "node:assert/strict";
import {RideStatus,transitionRide,InvalidRideTransition} from "./ride-state-machine.mjs";

test("requested ride moves through full lifecycle",()=>{
  const requested={id:"trip-101",status:RideStatus.REQUESTED,version:0};
  const accepted=transitionRide(requested,RideStatus.ACCEPTED,{actorId:"driver-1"});
  const arriving=transitionRide(accepted,RideStatus.ARRIVING,{actorId:"driver-1"});
  const inProgress=transitionRide(arriving,RideStatus.IN_PROGRESS,{actorId:"driver-1"});
  const completed=transitionRide(inProgress,RideStatus.COMPLETED,{actorId:"driver-1"});
  assert.equal(requested.status,"requested");
  assert.equal(completed.status,"completed");
  assert.equal(completed.version,4);
  assert.equal(completed.history.length,4);
});
test("terminal states cannot be reopened",()=>{
  assert.throws(()=>transitionRide({id:"trip-2",status:RideStatus.COMPLETED,version:4},RideStatus.ACCEPTED,{actorId:"driver-1"}),InvalidRideTransition);
});
test("cancellation allowed before pickup but not direct completion",()=>{
  const requested={id:"trip-3",status:RideStatus.REQUESTED,version:0};
  assert.equal(transitionRide(requested,RideStatus.CANCELLED,{actorId:"rider-1"}).status,"cancelled");
  assert.throws(()=>transitionRide(requested,RideStatus.COMPLETED,{actorId:"rider-1"}),InvalidRideTransition);
});

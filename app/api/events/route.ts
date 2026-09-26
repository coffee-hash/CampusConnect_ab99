import { events } from "@/data/events";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";


// GET ALL EVENTS
export async function GET() {
  return NextResponse.json(events);
}


// CREATE EVENT
export async function POST(req: Request) {

  try {

    const body = await req.json();


    const newEvent = {
  id: randomUUID(),

  name: body.name,

  description: body.description,

  category: body.category,

  date: body.date,

  venue: body.venue,

  capacity: Number(body.capacity),

  seatsAvailable:
    body.seatsAvailable ?? Number(body.capacity),

  organizerId: body.organizerId,

  cancelled:false
};


    events.push(newEvent);


    return NextResponse.json(
      newEvent,
      {
        status:201
      }
    );


  } catch(error){

    return NextResponse.json(
      {
        error:"Failed to create event"
      },
      {
        status:500
      }
    );

  }

}
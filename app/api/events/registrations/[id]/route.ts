import { registrations } from "@/data/registrations";
import { events } from "@/data/events";
import { NextResponse } from "next/server";


export async function DELETE(
  req: Request,
  context: {
    params:{
      id:string
    }
  }
){

  try{

    const id = context.params.id;


    const registrationIndex =
      registrations.findIndex(
        reg => reg.id === id
      );


    if(registrationIndex === -1){

      return NextResponse.json(
        {
          error:"Registration not found"
        },
        {
          status:404
        }
      );

    }


    const registration =
      registrations[registrationIndex];


    // prevent double cancellation
    if(registration.status === "cancelled"){

      return NextResponse.json(
        {
          error:"Registration already cancelled"
        },
        {
          status:400
        }
      );

    }



    // cancel registration

    registrations[registrationIndex] = {
      ...registration,
      status:"cancelled"
    };



    // restore event seat

    const eventIndex =
      events.findIndex(
        event => event.id === registration.eventId
      );



    if(eventIndex !== -1){

      events[eventIndex] = {
        ...events[eventIndex],
        seatsAvailable:
          events[eventIndex].seatsAvailable + 1
      };

    }



    return NextResponse.json(
      registrations[registrationIndex]
    );


  }
  catch(error){

    return NextResponse.json(
      {
        error:"Failed to cancel registration"
      },
      {
        status:500
      }
    );

  }

}
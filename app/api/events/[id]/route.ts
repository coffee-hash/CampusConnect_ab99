import { events } from "@/data/events";
import { NextResponse } from "next/server";


// UPDATE EVENT
export async function PATCH(
  req: Request,
  {
    params
  }: {
    params:{
      id:string
    }
  }
){

  try{

    const id = params.id;


    const body = await req.json();


    const index = events.findIndex(
      (event)=>event.id===id
    );


    if(index===-1){

      return NextResponse.json(
        {
          error:"Event not found"
        },
        {
          status:404
        }
      );

    }


    events[index]={
      ...events[index],
      ...body
    };


    return NextResponse.json(
      events[index]
    );


  }
  catch(error){

    return NextResponse.json(
      {
        error:"Failed to update event"
      },
      {
        status:500
      }
    );

  }

}





// DELETE EVENT
export async function DELETE(
  req:Request,
  {
    params
  }:{
    params:{
      id:string
    }
  }
){

  try{


    const id=params.id;


    const index=events.findIndex(
      (event)=>event.id===id
    );



    if(index===-1){

      return NextResponse.json(
        {
          error:"Event not found"
        },
        {
          status:404
        }
      );

    }



    events[index]={
      ...events[index],
      cancelled:true
    };



    return NextResponse.json(
      events[index]
    );


  }
  catch(error){

    return NextResponse.json(
      {
        error:"Failed to cancel event"
      },
      {
        status:500
      }
    );

  }

}
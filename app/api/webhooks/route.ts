import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
 
export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  //esse headers precisam ser passados por questões de segurança
  //esses hedears caso forem passados vamos poder utilzar o webhook e acessar db
  //caso contrario n
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  //para caso nao vier os cabeçalhos do next quebra o codigo aq
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  //esse payload vai ter o data do usuario passado
  //e como vem de um req tem que vir com json
  //ai depois pega o json e passamos para um objeto 
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 

  if(eventType === "user.created"){
    await db.user.create({
       data : {
           externalUserId : payload.data.id,
           username : payload.data.username,
           imageUrl : payload.data.image_url,
       
       }
    })
}

if(eventType === "user.updated"){
   const user =  await db.user.findUnique({
        where : {externalUserId : payload.data.id}
    })

    if(!user){
        return new Response("usuario nao encontrado",{status : 404})
    }

    await db.user.update({
        where : {externalUserId : payload.data.id},
        data : {
            username : payload.data.username,
            imageUrl : payload.data.image_url,
        }
    })
}

if(eventType === "user.deleted"){

    const user =  await db.user.findUnique({
        where : {externalUserId : payload.data.id}
    })

    if(!user){
        return new Response("usuario nao encontrado",{status : 404})
    }

    await db.user.delete({
        where : {externalUserId : payload.data.id}
    })
}

  return new Response('', { status: 200 })


}


 
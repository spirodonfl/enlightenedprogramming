export async function onRequestPost(context) {
    const { request, env } = context;

    // Parse the form data
    const formData = await request.formData();
    const email = formData.get('email');

    // Validate email (basic validation)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return new Response('Invalid email', { status: 400 });
    }

    try {
        // Check if the email already exists
        const existingSubscriber = await env.MAIL_LIST.get(email);
        
        if (existingSubscriber) {
            return new Response('Email already subscribed', { status: 409 });
        }

        // If email doesn't exist, store it in Cloudflare KV
        await env.MAIL_LIST.put(email, JSON.stringify({ subscribed: new Date() }));

        // Optionally, send a confirmation email here

        return new Response('Subscribed successfully', { status: 200 });
    } catch (error) {
        return new Response('Error processing subscription', { status: 500 });
    }
}
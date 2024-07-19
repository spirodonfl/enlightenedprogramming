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
        // Store the email in Cloudflare KV (you need to set up a KV namespace)
        await env.MAIL_LIST.put(email, JSON.stringify({ subscribed: new Date() }));

        // Optionally, send a confirmation email here

        return new Response('Subscribed successfully', { status: 200 });
    } catch (error) {
        return new Response('Error subscribing', { status: 500 });
    }
}
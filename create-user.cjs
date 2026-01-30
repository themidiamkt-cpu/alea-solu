const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vuyeufackfhcevtegtpi.supabase.co';
// WARNING: The user provided key 'sb_secret_...' implies a secret or non-standard key. 
// If this fails, it's likely because this is not the valid 'anon' public key.
const supabaseKey = 'sb_secret_HyWQeFU0-gaBEqui9Wmryg_zq_-7shS';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
    console.log("Attempting to create user with provided credentials...");
    const { data, error } = await supabase.auth.signUp({
        email: 'themidiamkt@gmail.com',
        password: '123456@',
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully:', data.user ? data.user.email : 'No user data returned but no error.');
    }
}

createUser();

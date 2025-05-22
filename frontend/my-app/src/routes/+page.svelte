<script>
  let name = '';
  let email = '';
  let time=''
  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name, email ,time};
    console.log("Sending data:", data);

    const result = await fetch('http://localhost:3000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await result.json();
    alert(res.message);
  };
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: sans-serif;
    background-color: #f7f7f7;
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: #333;
  }

  form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 300px;
  }

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
    color: #555;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.75rem;
    width: 100%;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  button:hover {
    background-color: #005fd0;
  }
</style>

<main>
  <h1>DailyLC</h1>
  <form on:submit={handleSubmit}>
    <label>
      Your name:
      <input type="text" bind:value={name} required />
    </label>
    <label>
      Your email:
      <input type="email" bind:value={email} required />
    </label>
    <label>
      Preferred Time:
      <input type="time" bind:value={time} required />
        <small style="color: red; font-size: 0.8rem;">Please enter time in 24-hour format (HH:MM)</small>
    </label>
    <button type="submit">Send</button>
  </form>
</main>

<script>
  const TIMEOUT_MS = 7000; // 7 seconds timeout

  // @ts-ignore
  function timeoutPromise(promise, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
      promise
        // @ts-ignore
        .then(res => {
          clearTimeout(timer);
          resolve(res);
        })
        // @ts-ignore
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  let name = '';
  let email = '';
  let time = '';
  let loading = false;

  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();
    loading = true;

    const data = { name, email, time };
    console.log("Sending data:", data);

    try {
      const response = await timeoutPromise(
        fetch("http://localhost:3000/data", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
        TIMEOUT_MS
      );

      const res = await response.json();
      alert(res.message);

      // Optional: clear form inputs after success
      if (res.message.toLowerCase().includes("success")) {
        name = '';
        email = '';
        time = '';
      }
    } catch (err) {
      // @ts-ignore
      if (err.message === "Request timed out") {
        alert("Server took too long to respond. Please try again later.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      loading = false;
    }
  };
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Name:
      <input
        type="text"
        bind:value={name}
        placeholder="Your name"
        required
      />
    </label>

    <label>
      Email:
      <input
        type="email"
        bind:value={email}
        placeholder="Your email"
        required
      />
    </label>

    <label>
      Preferred Time:
      <input
        type="time"
        bind:value={time}
        required
      />
    </label>

    <button type="submit" disabled={loading}>
      {#if loading}
        Submitting...
      {:else}
        Submit
      {/if}
    </button>
  </form>
</main>

<style>
  main {
    max-width: 400px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
  }
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input, button {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
  }
  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

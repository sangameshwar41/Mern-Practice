function Home() {
  function handleSubmit(event) {
    event.preventDefault();
    alert('Form submitted successfully!');
  }

  return (
    <div className="page-container">
      <section className="hero-section">
        <h1>Home Page</h1>
        <p>
          We provide web development, UI design, and maintenance services.
        </p>
      </section>

      <section className="content-section">
        <h2>Contact Form</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your comments"
              rows="4"
              required
            />
          </div>

          <button className="primary-button" type="submit">
            Submit
          </button>
        </form>
      </section>

      <section className="content-section">
        <h2>Our Services</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Web Development</td>
                <td>Website creation</td>
                <td>₹5,000</td>
              </tr>

              <tr>
                <td>UI Design</td>
                <td>Website interface design</td>
                <td>₹3,000</td>
              </tr>

              <tr>
                <td>Maintenance</td>
                <td>Website updates and fixes</td>
                <td>₹1,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Home;
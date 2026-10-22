function ContactUs() {
  function handleSubmit(event) {
    event.preventDefault();
    alert('Your form has been submitted successfully.');
  }

  return (
    <div className="page-container">
      <section className="page-heading">
        <h1>Contact Us</h1>
        <p>Have a question? Send us a message.</p>
      </section>

      <section className="contact-layout">
        <div className="contact-information">
          <h2>Get in Touch</h2>

          <p>
            Fill in the form and share your question or feedback.
          </p>

          <p><strong>Email:</strong> support@example.com</p>
          <p><strong>Working Hours:</strong> Monday to Friday</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message"
              rows="5"
              required
            />
          </div>

          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
}

export default ContactUs;
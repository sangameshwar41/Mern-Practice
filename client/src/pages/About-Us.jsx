import Card from '../components/Card.jsx';

function AboutUs() {
  return (
    <div className="page-container">
      <section className="page-heading">
        <h1>About Us</h1>
        <p>
          Learn more about our work, our values, and our approach.
        </p>
      </section>

      <section className="content-section">
        <h2>Who We Are</h2>

        <p>
          We are a team focused on building useful digital solutions.
          Our goal is to create websites that are attractive,
          accessible, responsive, and easy to use.
        </p>

        <h2>Our Mission</h2>

        <p>
          Our mission is to provide reliable web solutions that help
          people and businesses achieve their goals.
        </p>

        <div className="card-grid">
          <Card
            title="Our Vision"
            content="To make digital experiences simple and accessible to everyone."
          />

          <Card
            title="Our Values"
            content="We value quality, teamwork, continuous learning, and reliability."
            
          />
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
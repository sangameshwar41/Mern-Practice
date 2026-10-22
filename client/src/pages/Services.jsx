import Card from '../components/Card.jsx';

function Services() {
  return (
    <div className="page-container">
      <section className="page-heading">
        <h1>Our Services</h1>
        <p>Explore our services and compare the sample prices.</p>
      </section>

      <section className="content-section">
        <div className="card-grid">
          <Card
            title="Web Development"
            content="Website creation with responsive layouts and modern design."
          />

          <Card
            title="UI Design"
            content="Clean layouts that make websites easy to understand."
          />

          <Card
            title="Maintenance"
            content="Website updates, improvements, and routine fixes."
          />
        </div>

        <h2 className="table-heading">Service Price List</h2>

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

export default Services;
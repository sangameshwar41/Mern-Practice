import Button from './Button.jsx';

function Card({ title, content, buttonName }) {
  return (
    <article className="card">
      <h3>{title}</h3>

      <p>{content}</p>

      {buttonName && <Button buttonName={buttonName} />}
    </article>
  );
}

export default Card;
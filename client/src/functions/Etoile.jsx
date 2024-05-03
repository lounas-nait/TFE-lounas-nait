
export const generateStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const emptyStars = totalStars - filledStars;
    const filledStar = '★';
    const emptyStar = '☆';
    
    const stars = filledStar.repeat(filledStars) + emptyStar.repeat(emptyStars);
    return <span className="star-rating">{stars}</span>;
  };
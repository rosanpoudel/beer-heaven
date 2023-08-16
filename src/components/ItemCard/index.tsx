import { textTruncate } from '@/helpers/utils';
import { CardTypes } from '@/types/index.types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ItemCard = ({
  name,
  tagline,
  description,
  image_url,
  ingredients,
}: CardTypes) => {
  return (
    <div className="item-card">
      <div className="item-image">
        <OverlayTrigger
          delay={{ hide: 450, show: 300 }}
          overlay={(props) => (
            <Tooltip {...props}>ingredients: {ingredients}</Tooltip>
          )}
          placement="top"
        >
          <img src={image_url} alt={name} />
        </OverlayTrigger>
      </div>
      <div className="item-details">
        <h3 className="item-title">{name}</h3>
        <p className="item-cat">{tagline}</p>
        {/* <p className="item-desc">{textTruncate(description, 195)}</p> */}
        <p className="item-desc">{description}</p>
      </div>
    </div>
  );
};

export default ItemCard;

import React from 'react'

const DeckListItem = (id, title, author, author_id) => {
  <div>
    <div>
      <Link to={`/cards/${id}`}>
        {title}
      </Link>
    </div>
    <div>
      By <Link to={`/user/${author_id}`}>
        {author}
      </Link>
    </div>
  </div>
}
import React from 'react'
import Vote from './Vote'
import {Link, withRouter} from 'react-router-dom'
import HistoryLink from './HistoryLink'
import {formatDate} from './Utility'
import Checkbox from 'material-ui/Checkbox'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

const Deck = ({deck, shuffle, facing, changeFacing, changeShuffle}) => (
  <div>
    <Header
      title={deck.title}
      author={deck.author}
      author_id={deck.author_id}
    />
    <EnterEdit />

    {deck.cards.length > 0 
      ?
      <div>
        <EnterFlashcards />
        <Options>
          <ShuffleOption 
            shuffle={shuffle}
            handleChange={changeShuffle}
          />
          <FacingOption 
            facing={facing}
            handleChange={changeFacing}
          />
        </Options>
        <Hints />
      </div> 
      :
      <NoCards id={deck.id} />
    }
    
    <Vote 
      deck_id={deck.id}
    />
    <DeckInfo
      is_public={deck.is_public}
      deck_length={deck.cards.length}
      date_created={deck.date_created}
      last_edited={deck.last_updated}
    />
  </div>
)

const Header = ({title, author, author_id}) => (
  <div>
    <h2>{title}</h2>
    <div>
      By <Link to={`/user/${author_id}`}>{author}</Link>
    </div>
  </div>
)

const EnterFlashcards = withRouter(({match}) => {
  return <HistoryLink to={`${match.url}/flashcards`}>Start</HistoryLink>
})

const EnterEdit = withRouter(({match}) => {
  return <HistoryLink to={`${match.url}/edit`}>Edit</HistoryLink>
})

const Options = ({children}) => (
  <form>
    <div>Options</div>
    {children}
  </form>
)

const ShuffleOption = ({shuffle, handleChange}) => (
  <div>
    <Checkbox
      label="Shuffle Deck"
      name="is-public"
      value={shuffle}
      onCheck={handleChange}
      checked={shuffle}
    />
  </div>
)

const FacingOption = ({facing, handleChange}) => (
  <div>
    <div>Default Card Face</div>
    <RadioButtonGroup
      defaultSelected="front"
      valueSelected={facing}
      onChange={handleChange}
    >
      <RadioButton
        value="front"
        label="Front"
      />
      <RadioButton
        value="back"
        label="Back"
      />
    </RadioButtonGroup>
  </div>
)

const Hints = () => (
  <div>
    Hint: You can use the keyboard to navigate the flashcards.  Use the left and right arrow keys 
    to go to the previous and next flashcard, respectively.  Use the up or down arrow keys to 
    flip the flashcard.
  </div>
)

const DeckInfo = ({is_public, deck_length, date_created, last_edited}) => (
  <div>
    <div>{is_public ? 'Public Deck' : 'Private Deck'}</div>
    <div>{deck_length} cards</div>
    <div>Created {formatDate(date_created)}</div>
    {last_edited ? <div>Last updated {formatDate(last_edited)}</div> : null}
  </div>
)

const NoCards = ({deck_id}) => (
  <div>
    There are currently no cards in this deck.  If you are the deck author, please add 
    some cards by <Link to={`/edit/${deck_id}`}>editing it</Link>.
  </div>
)

export default Deck

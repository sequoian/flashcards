import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import PersonIcon from 'material-ui/svg-icons/social/person'
import Divider from 'material-ui/Divider'

const Header = ({user, logout}) => (
  <div className="header">
    <Nav />
    {user ? <UserDisplay user={user} logout={logout} /> : <GuestDisplay />}
  </div>
)

const Nav = () => (
  <nav>
    <ul>
      <Link to="/"><li>Browse</li></Link>
      <Link to="/my-cards"><li>My Flashcards</li></Link>
      <Link to="/new"><li>Create Flashcards</li></Link>
    </ul>
  </nav>
)

const UserDisplay = ({user, logout}) => (
  <span>
    <ComposedUserPopover
      logout={logout}
      user={user}
    />
  </span>
)

class UserPopover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleTouchTap(event) {
    // this prevents ghost click
    event.preventDefault()
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <div>
        <IconButton
          onClick={this.handleTouchTap}
          iconStyle={{width: 46, height: 46}}
          style={{width: 48, height: 48, padding: 2}}
        >
          <PersonIcon />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{"horizontal":"right","vertical":"bottom"}}
          targetOrigin={{"horizontal":"right","vertical":"top"}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu
            style={{'max-width': '100vw'}}
          >
            <div
              style={{
                padding: 20,
                'font-size': 16
              }}
            >
              <span
                style={{
                  'font-size': 20,
                  'font-weight': 'bold'
                }}
              >
                {this.props.user.name}
              </span> is logged in
            </div>
            <Divider />
            <MenuItem
              primaryText="Profile"
              onClick={() => {
                this.handleRequestClose()
                this.props.history.push('/profile')
              }}
            />
            <MenuItem 
              primaryText="Logout" 
              onClick={this.props.logout}
            />
          </Menu>
        </Popover>
      </div>
    )
  }
}

const ComposedUserPopover = withRouter(UserPopover)

const GuestDisplay = () => (
  <span><Link to="/signup">Sign Up</Link> | <Link to="/login">Log In</Link></span>
)

export default Header;

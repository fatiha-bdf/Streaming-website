import React from "react";
import Header from '../../common/Header';
import Sidebar from '../../common/SideBar';
import Footer from '../../common/Footer';
import { connect } from "react-redux";
import { push } from "react-router-redux";
import './chat.css';
import { GetuserChatContact } from '../../../store/actions/UsersActions/GetUserChatContactAction';
import Moment from 'moment';
import { GetCurrentUserInfo } from '../../../store/actions/UsersActions/FetchCurrentUserInfoAction';
import { saveUserChatAction } from '../../../store/actions/UsersActions/SaveUserchatMsgAction';
import { GetuserChatMsg } from '../../../store/actions/UsersActions/GetUserChatMessagesAction';
import io from 'socket.io-client';


class Chat extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         socket: io(process.env.REACT_APP_API_URL),
         firstname: "",
         lastname: "",
         profilePhoto: "",
         msgContent: "",
         allUserChatContact: [],
         messagesInfo: [],
         initChatMessage: <li className="left clearfix">
            <span className="chat-img1 pull-left">
               <img src="https://lh6.googleusercontent.com/-y-MY2satK-E/AAAAAAAAAAI/AAAAAAAAAJU/ER_hFddBheQ/photo.jpg" alt="User Avatar" className="img-circle" />
            </span>
            <div className="chat-body1 clearfix">
               <p>Hello I am a robot. Welcome to your chat box choose a user to start chatting.</p>
               <div className="chat_time pull-right">09:40PM</div>
            </div>
         </li>
      }

      this.sendMessageToUser = this.sendMessageToUser.bind(this);
      this.selectChatContact = this.selectChatContact.bind(this);
      this.handleChange = this.handleChange.bind(this);
   }

   componentDidMount() {
      let room = localStorage.getItem("userId");
      this.state.socket.connect(true);
      this.state.socket.emit('join', room);
      this.state.socket.on("send-new-msg", (msg) => {
         if (this.state.messagesInfo.dest_userId !== undefined) {
            let allMsg = this.state.messagesInfo;
            allMsg.messages.push(msg);
            this.setState({
               messagesInfo: allMsg
            })
            // var elmnt = document.getElementById("content");
            // elmnt.scrollIntoView();   
         }
      })
   }

   handleChange(event) {
      event.preventDefault();
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
         [name]: value
      });

   }

   sendMessageToUser(e) {
      e.preventDefault();
      let Allmessages = [];
      let socketMsg = {};
      if (this.state.messagesInfo.length !== 0 && this.state.messagesInfo.messages) {
         Allmessages = this.state.messagesInfo;
         socketMsg = {
            pos: "left",
            photo: this.state.profilePhoto,
            msgData: this.state.msgContent,
            data: Moment()
         };

         Allmessages.messages.push({
            pos: "right",
            photo: this.state.profilePhoto,
            msgData: this.state.msgContent,
            data: Moment()
         })
         this.setState({
            messagesInfo: Allmessages,
         })
         this.props.onsaveUserChatAction(Allmessages);
         setTimeout(() => {
            this.state.socket.emit('new-msg', { msg: socketMsg, room: this.state.messagesInfo.dest_userId })
            this.setState({
               msgContent: ""
            })
            let data = {
               id: parseInt(this.state.messagesInfo.source_userId) + 
               parseInt(this.state.messagesInfo.dest_userId),
               title: "message",
               fullname: "",
               msg: " messaged you on chatApp ",
               likerId: parseInt(this.state.messagesInfo.source_userId),
               likedId: parseInt(this.state.messagesInfo.dest_userId),
               time: Moment()
           }
           this.state.socket.emit('likeUser', data)
         }, 200)
      } else {
         console.log("Please choose a user to chat with !")
      }

      // var elmnt = document.getElementById("content");
      // elmnt.scrollIntoView();
   }

   async UNSAFE_componentWillMount() {
      let userId = localStorage.getItem("userId");
      await this.props.onGetCurrentUserInfo(userId);
      await this.props.onGetuserChatContact();
   }

   async selectChatContact(e, user) {
      e.preventDefault();
      let userId = localStorage.getItem("userId");
      await this.props.onGetuserChatMsg(user.userId);
      // Get all user messages sorted by date
      // init user objs
      this.setState({
         messagesInfo: {
            dest_userId: user.userId,
            source_userId: userId,
            dest_fullname: user.fullname,
            dest_photo: user.profilePhoto,
            messages: []
         },
      })

      setTimeout(() => {
         // var elmnt = document.getElementById("content");
         // elmnt.scrollIntoView();
      }, 20);
   }

   getProfilePicture(pictures, state) {
      let pics = [];
      let i = 0;
      while (i < pictures.length) {
         if (pictures[i].state === state)
            pics.push(pictures[i].path)
         i++;
      }

      return pics;
   }

   initProfileInformation(data) {
      let userInfo = data.info;
      let profilePhoto = this.getProfilePicture(data.pictures, 1);

      this.setState({
         firstname: userInfo.firstname,
         lastname: userInfo.lastname,
         profilePhoto: profilePhoto.length > 0 ? profilePhoto : "",
      })
   }

   initMegList(msgs) {
      if (msgs && msgs.length > 0) {
         let msgsList = [];
         msgsList = msgs.map(msg => {
            return ({
               pos: msg.source_user_id === parseInt(this.state.messagesInfo.source_userId)
                  ? "right" : "left",
               photo: msg.source_user_id === parseInt(this.state.messagesInfo.source_userId)
                  ? this.state.profilePhoto : this.state.messagesInfo.dest_photo,
               msgData: msg.message_text,
               date: msg.createdAt
            })
         })

         let msgInfo = this.state.messagesInfo;
         msgInfo.messages = msgsList
         this.setState({
            messagesInfo: msgInfo
         })
      }
   }


   UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.getContactChat !== "" && nextProps.getContactChat.code === 200) {
         this.setState({
            allUserChatContact: nextProps.getContactChat.data
         })
      }
      if (nextProps.getUserChatMsg !== "" && nextProps.getUserChatMsg.code === 200) {
         this.initMegList(nextProps.getUserChatMsg.data);
      }
      if (nextProps.getCurrentProfileInfo.data)
         this.initProfileInformation(nextProps.getCurrentProfileInfo.data);
   }


   render() {

      return (
         <div>
            <Header />
            <Sidebar />
            <div>
               <div className="content-wrapper">
                  <section className="content">
                     <section className="content">

                        <div className="row">
                           <div className="col-md-12">
                              <div className="box box-primary" id="fixMarginTop">
                                 <div className="box-header with-border">
                                    <h3 className="box-title">Chat</h3>

                                    <div className="box-tools pull-right">
                                       <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                                       </button>
                                       <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times"></i></button>
                                    </div>
                                 </div>
                                 <div className="box-body">
                                    <div className="row">

                                       <div className="col-md-12">
                                          <div style={{ 'height': '100px' }}>
                                             <div>
                                                <div className="col-sm-3 chat_sidebar">
                                                   <div className="row">
                                                      <div id="custom-search-input">
                                                         <div className="input-group col-md-12">
                                                            <input type="text" className="  search-query form-control" placeholder="Conversation" />
                                                            <button className="btn btn-danger" type="button">
                                                               <span className=" glyphicon glyphicon-search"></span>
                                                            </button>
                                                         </div>
                                                      </div>

                                                      <div className="member_list">
                                                         <ul className="list-unstyled">
                                                            {this.state.allUserChatContact ?
                                                               this.state.allUserChatContact.map((user, i) => {
                                                                  return  user.profilePhoto !== "" ?
                                                                  <li key={i} onClick={(e) => { this.selectChatContact(e, user) }} className="left clearfix">
                                                                  <span className="chat-img pull-left">
                                                                     <img src={user.profilePhoto.toString().substring(0, 5) === 'https' ?
                                                                         user.profilePhoto : 
                                                                         process.env.REACT_APP_API_URL +
                                                                        "/" + user.profilePhoto
                                                                     } alt="User Avatar" className="img-circle" />
                                                                  </span>
                                                                  <div className="chat-body clearfix">
                                                                     <div className="header_sec">
                                                                        <strong className="primary-font">{user.fullname}</strong>
                                                                        {/* <strong className="pull-right"> */}
                                                                        {/* 09:45AM</strong> */}
                                                                     </div>
                                                                     <div className="contact_sec">
                                                                        {/* <strong className="primary-font">(123) 123-456</strong> <span className="badge pull-right">3</span> */}
                                                                     </div>
                                                                  </div>
                                                               </li>
                                                                  : ""
                                                               })
                                                               : ""}

                                                         </ul>
                                                      </div></div>
                                                </div>

                                                <div className="col-sm-9 message_section">
                                                   <div className="row">
                                                      <div className="new_message_head">
                                                         <div className="pull-left"><button><i className="fa fa-plus-square-o" aria-hidden="true"></i> New Message</button></div><div className="pull-right"><div className="dropdown">
                                                            <button className="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                               <i className="fa fa-cogs" aria-hidden="true"></i>  Setting
    <span className="caret"></span>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                                               <li><a href="#">Action</a></li>
                                                               <li><a href="#">Profile</a></li>
                                                               <li><a href="#">Logout</a></li>
                                                            </ul>
                                                         </div></div>
                                                      </div>

                                                      <div className="chat_area">
                                                         <ul className="list-unstyled">
                                                            {this.state.messagesInfo.length === 0 ? this.state.initChatMessage : ""}
                                                            {this.state.messagesInfo.length !== 0 && this.state.messagesInfo.messages.length === 0 ?
                                                               <li className="left clearfix">
                                                                  <div className="chat-body1 clearfix">
                                                                     <p>Now chatting with <b>{this.state.messagesInfo.dest_fullname}</b></p>
                                                                     <div className="chat_time pull-right">09:40PM</div>
                                                                  </div>
                                                               </li>
                                                               : ""}



                                                            {/* <li className="left clearfix">
                                                               <span className="chat-img1 pull-left">
                                                                  <img src="https://lh6.googleusercontent.com/-y-MY2satK-E/AAAAAAAAAAI/AAAAAAAAAJU/ER_hFddBheQ/photo.jpg" alt="User Avatar" className="img-circle" />
                                                               </span>
                                                               <div className="chat-body1 clearfix">
                                                                  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classNameical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia.</p>
                                                                  <div className="chat_time pull-right">09:40PM</div>
                                                               </div>
                                                            </li> */}

                                                            {this.state.messagesInfo.length !== 0 && this.state.messagesInfo.messages.length > 0 ?
                                                               this.state.messagesInfo.messages.map((msg, i) => {
                                                                  return <li key={i} className="left clearfix admin_chat">
                                                                     <span className={'chat-img1 pull-' + msg.pos}>
                                                                        <img src={msg.photo.toString().substring(0, 5) === 'https' ?
                                                                        msg.photo :
                                                                           process.env.REACT_APP_API_URL + "/" + msg.photo
                                                                        } alt="User Avatar" className="img-circle" />
                                                                     </span>
                                                                     <div className="chat-body1 clearfix">
                                                                        <p>{msg.msgData}</p>
                                                                        <div className="chat_time pull-left">{Moment(msg.date).fromNow()}</div>
                                                                     </div>
                                                                  </li>
                                                               })


                                                               : ""}

                                                            <li style={{ 'marginBottom': '1.5vw' }} id="content"></li>
                                                         </ul>
                                                      </div>

                                                      <div className="message_write" >
                                                         <textarea className="form-control" name="msgContent" value={this.state.msgContent} onChange={this.handleChange} placeholder="type a message"></textarea>
                                                         <div className="clearfix"></div>
                                                         <div onClick={(e) => { this.sendMessageToUser(e) }} className="chat_bottom">
                                                            <a href="#" className="pull-left btn btn-success">
                                                               Send</a></div>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>

                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>


                  </section>
               </div>
            </div>
            <Footer />
         </div>

      );
   }
}

const state = (state, ownProps = {}) => {
   return {
      getUserChatMsg: state.getUserChatMsg.getUserChatMsg,
      getCurrentProfileInfo: state.getCurrentProfileInfo.getCurrentProfileInfo,
      getContactChat: state.getContactChat.getContactChat,
      location: state.location,
   }
}

const mapDispatchToProps = (dispatch, ownProps) => {
   return {
      navigateTo: (location) => {
         dispatch(push(location));
      },
      onGetuserChatContact: () => dispatch(GetuserChatContact()),
      onGetCurrentUserInfo: (userId) => dispatch(GetCurrentUserInfo(userId)),
      onsaveUserChatAction: (data) => dispatch(saveUserChatAction(data)),
      onGetuserChatMsg: (dest_userId) => dispatch(GetuserChatMsg(dest_userId))
   }
};

export default connect(state, mapDispatchToProps)(Chat);

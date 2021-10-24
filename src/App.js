import logo from "./logo.svg";
import "./App.css";
import "./styling.css";
import React, { Component } from "react";
import { get_data, get_questions, get_topics } from "./database";
import download from "./images/download.png"; //importing images
import dsa from "./images/dsa.jpg";
import title from "./images/cover.png";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Page from "./pagination";
import Progress_bar from "./progressbar";
 

//inspect->application->localstorage->our site(stored data can be seen here)
//for using local storage use localstorage.setItem(key,value) value should always be string(use JSON.stringify).
//for getting the value use localstorage.get(key) , returns a json string , use JSON.parse(string) for converting to array.
//arr.slice(start,end)
class App extends Component {
  state = {
    data: [],
    topics: [],
    questions: [],
    sstatus: null,
    stopic: null,
    sname: null,
    currques: null,
    currnote: null,
    currpage:1,
  };
  handleClickOpen = (obj) => {
    this.setState({ currques: obj, currnote: obj.notes });
  };
  handleClose = () => {
    this.setState({ currques: null });
  };
  handlesave = () => {
    var tot = [...this.state.questions];
    var { currques, currnote } = this.state;
    if (currnote != null) {
      var ind = tot.indexOf(currques);
      tot[ind].notes = currnote;
    }
    localStorage.setItem("questions", JSON.stringify(tot));
    this.setState({ questions: tot, currques: null, currnote: null });
  };
  notes = () => {
    return (
      <Dialog
        open={this.state.currques != null}
        onClose={() => {
          this.handleClose();
        }}
      >
        <DialogTitle>{this.state.currques.Problem}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <textarea
              cols="40"
              rows="10"
              value={this.state.currnote}
              onChange={(e) => {
                this.setState({ currnote: e.target.value });
              }}
            ></textarea>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.handleClose();
            }}
            color="primary"
            autoFocus
          >
            Close
          </Button>
          <Button
            onClick={() => {
              this.handlesave();
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  componentDidMount() {
    var s = localStorage.getItem("questions"),
      questions;
    if (s != null) {
      questions = JSON.parse(s);
    } else {
      questions = get_questions();
      for (var obj of questions) {
        obj["wishlist"] = false;
        obj["notes"] = "";
      }
    }
    var topics = [...get_topics()];
    this.setState({ topics, questions });
  }
  select_status = (e) => {
    var status = e.target.value;
    if (status == "null") status = null;
    this.setState({ sstatus: status });
  };
  select_topic = (e) => {
    var topic = e.target.value;
    if (topic == "null") topic = null;
    this.setState({ stopic: topic });
  };
  select_name = (e) => {
    var name = e.target.value;
    if (name.length == 0) {
      name = null;
    }
    this.setState({ sname: name });
  };
  changestate = (obj) => {
    var tot = this.state.questions;
    var ind = tot.indexOf(obj);
    var status = tot[ind].Done;
    tot[ind].Done = !status;
    var str = JSON.stringify(tot);
    localStorage.setItem("questions", str);
    this.setState({ questions: tot });
  };
  addtolist = (obj) => {
    var tot = this.state.questions;
    var ind = tot.indexOf(obj);
    var status = tot[ind].wishlist;
    tot[ind].wishlist = !status;
    var str = JSON.stringify(tot);
    localStorage.setItem("questions", str);
    this.setState({ questions: tot });
  };
  changepage=(id) => {
        this.setState({currpage:id});
        window.scroll(0, 0); 
  }
  row_class=(obj)=>{
      if(obj.Done){ 
        console.log(obj);
        return "complete";
      }
      else return "";
  }
  render() {
    var { sname, stopic, sstatus,currpage } = this.state;
    var tot = this.state.questions.filter((ques) => {
      if (sstatus === null) return true;
      else if (
        (ques.Done === true && sstatus == "True") ||
        (ques.Done === false && sstatus == "False") ||
        (ques.wishlist === true && sstatus === "Wishlist")
      )
        return true;
      else return false;
    });

    tot = tot.filter((ques) => {
      return (
        sname == null ||
        ques.Problem.toString()
          .toLowerCase()
          .indexOf(sname.toString().toLowerCase()) != -1
      );
    });
    tot = tot.filter((ques) => {
      return stopic == null || ques.Topic == stopic;
    });
    var totpages=Math.floor(tot.length/20) + (tot.length%20!=0),solved=0; 
    for(var obj of tot){
       if(obj.Done){
         solved++;
       }
    }
    var now= tot.length>0?Math.round((solved/tot.length)*100):0;
    console.log(now);
       currpage-=1;
    if(totpages>1){
          var start=(currpage*20);
          tot=tot.slice(start,Math.min(tot.length,start+20));
    }
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ margin: "0px" }}>
          <h1 className="title">Coding Companion</h1>
          <hr></hr>
        </div>
        <div className="row" style={{ margin: "50px 0px" }}>
          <select
            className="dropdown"
            onChange={(e) => {
              this.select_topic(e);
            }}
          >
            <option className="option" value="null">
              All topics
            </option>
            {this.state.topics.map((topic) => (
              <option className="option" value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <select className="dropdown" onChange={(e) => this.select_status(e)}>
            <option className="option" value="null">
              All Categories
            </option>
            <option className="option" value="True">
              Solved
            </option>
            <option className="option" value="False">
              Unsolved
            </option>
            <option className="option" value="Wishlist">
              Wishlist
            </option>
          </select>
          <input
            type="text"
            className="search"
            value={this.state.sname}
            onChange={(e) => {
              this.select_name(e);
            }}
            placeholder="Search Questions"
          ></input>
        </div>
        <div style={{textAlign:'center'}}>
         <h3>Solved</h3>
        { (sstatus==null || sstatus=='Wishlist') && <Progress_bar bgcolor="#99ff66" progress={now}  height={30}   />}
        </div>
        <div  style={{marginBottom:'50px'}}>
          <table className="table">
            <thead>
              <th style={{ width: "50px" }}>
                <p>Status</p>
              </th>
              <th style={{ width: "900px" }}>
                <p>Title</p>
              </th>
              <th style={{ width: "100px" }}>
                <p>Notes</p>
              </th>
              <th style={{ width: "50px", margin: "2px" }}>
                <p>Wishlist</p>
              </th>
            </thead>
            {tot.map((quest) => {
              return (
                <tr  className={quest.Done?"complete":""}>
                  <td style={{ width: "50px" }}>
                    {quest.Done && (
                      <input
                        type="checkbox"
                        onChange={() => {
                          this.changestate(quest);
                        }}
                        checked
                      ></input>
                    )}
                    {!quest.Done && (
                      <input
                        type="checkbox"
                        onChange={() => {
                          this.changestate(quest);
                        }}
                      ></input>
                    )}
                  </td>
                  <td style={{ width: "900px" }}>
                    <a href={quest.URL} target="_blank">
                      <p>{quest.Problem}</p>
                    </a>
                  </td>
                  <td style={{ width: "100px" }}>
                    <button
                      onClick={() => {
                        this.handleClickOpen(quest);
                      }}
                    >
                      <img
                        src={download}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                        }}
                        alt="Not Available"
                      />
                    </button>
                  </td>
                  <td style={{ width: "50px" }}>
                    {quest.wishlist && (
                      <input
                        type="checkbox"
                        onChange={() => {
                          this.addtolist(quest);
                        }}
                        checked
                      ></input>
                    )}
                    {!quest.wishlist && (
                      <input
                        type="checkbox"
                        onChange={() => {
                          this.addtolist(quest);
                        }}
                      ></input>
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
           {totpages>1 && <Page  totalpages={totpages} changepage={this.changepage}/>}
        </div>
        {this.state.currques != null && this.notes()}
      </div>
    );
  }
}
export default App;

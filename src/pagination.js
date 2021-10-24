
/*
For Pagination use Material UI 
It gives the direct pagination component and any changes can be directly accessed using 
target.textContent
these changes should be reflected in main page contents by changing page={given} in the url
*/

import React, { Component } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import './styling.css';


class Page extends Component{
    onChange=(e)=>{
           const val=e.currentTarget.textContent;
           const {changepage}=this.props;
           changepage(val);
    }
    render() { 
        return ( 
        <Pagination  style={{display:'inline-block' , marginTop:'30px'}} count={this.props.totalpages} onChange={this.onChange} variant="outlined" color="primary" />
         );
    }
}
 
export default Page;
import {
  Template
} from 'meteor/templating'

import Data from '../../collections/Data'
import Thing from '../../collections/Thing'

// import './HomeLayout.html';

Template.HomeLayout.helpers({
  teste() {
    return 'aloha'
  },
  datalist() {
    return Data.find({})
  },
  things() {
    return Thing.find({})
  }
})
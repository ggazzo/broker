const headers = () => {

  return new Headers({
    'x-user-id': localStorage.getItem('Meteor.userId'),
    'x-auth-token': localStorage.getItem('Meteor.loginToken'),
  })
}

Api =  {
  data(id, key) {
    const request = new Request(`/api/v1/data/${ id }/${ key }`, {
      headers: headers()
    })
    return fetch(request).then(r => {
      return r.json()
    })
  }
}

export default Api

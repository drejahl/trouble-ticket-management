<template>
  <div class="troubleTicketList">
    <div align="left">
      <h3>Trouble Tickets (using V2 API)
        <button type="button" 
          class="btn btn-success btn-xs btn-create"
          data-toggle="modal" data-target="#troubleTicketModal"
          v-if="$route.path === '/'"
          v-on:click="$router.push('/new')">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>  Submit a new Trouble Ticket
        </button>
      </h3>
    </div>
    <p v-if="!troubleTicketList.length"><strong>No trouble tickets yet</strong></p>
    <table v-else class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="troubleTicket in troubleTicketList">
          <td> {{ troubleTicket.id }} </td>
          <td> {{ troubleTicket.type }} </td>
          <td> {{ troubleTicket.severity }} </td>
          <td> {{ troubleTicket.status }} </td>
          <td> {{ troubleTicket.statusChangeReason }} </td>
          <td> {{ troubleTicket.description }} </td>
          <td>
            <button type="button" class="btn btn-success btn-xs"
              data-toggle="modal" data-target="#troubleTicketModal"
              v-on:click="$router.push({name: 'troubleTicketEdit', params: {troubleTicketId: troubleTicket.id} })">
              <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
              edit
            </button>
              <div class="modal fade" id="troubleTicketModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title">Trouble Ticket</h4>
                    </div>
                    <div class="modal-body">
                      <router-view 
                          v-on:troubleticketupdate="troubleTicketUpdate"
                          v-on:troubleticketcreate="troubleTicketCreate"
                          v-on:cancelevent="cancel">
                      </router-view>
                    </div>
                  </div>
                </div>
              </div>
          </td>
        </tr>
      </tbody>
    </table>
  
  </div>
</template>

<script>
import axios from 'axios'

var config = require( '../config.json' );

export default {
  name: 'troubleTicketList',
    data () {
      // We want to start with an existing time entry
      return {
        troubleTicketList: []
      }},
  created: function() {
    const url = config.server_url + config.api_endpoint +
        "troubleTicket"

    this.fetchData( url )
  },
  methods: {
      troubleTicketCreate: function(troubleTicket) {
          $('#troubleTicketModal').modal('hide');

          // Push element to troubleTicketList
          this.troubleTicketList.push(troubleTicket)

          this.$router.push('/')
      },
      troubleTicketUpdate: function(troubleTicket) {
          $('#troubleTicketModal').modal('hide');

          // Update element in troubleTicketList
          let i = this.troubleTicketList.findIndex(function(element) { return element.id===troubleTicket.id })
          this.troubleTicketList[i] = troubleTicket

          this.$router.push('/')
      },
      fetchData: function(url){
        let self = this;

        axios.get(url, {
          dataType: 'json',
          headers: {
            'Accept': 'application/hal+json'
          },
          mode: 'no-cors' 
        })
        .then(function (response) {
          self.troubleTicketList = response.data
          console.log('GET SUCCESS')
        })
        .catch(function (error) {
          console.log(error)
        })
      },

      cancel: function() {
          $('#troubleTicketModal').modal('hide');
          this.$router.push('/')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div {
  padding-left: 15px;
  padding-right: 15px;
}

table {
  margin-top: 30px;
}

th, td {
  color: black;
  text-align: left
}
p {
  margin-left:18px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.btn-create {
  margin-left: 20px;
}

.modal-dialog {
  width: 80%; /* respsonsive width */
  min-width: 800px;
}

</style>

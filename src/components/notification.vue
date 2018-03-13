<template>
<div>
  <div class="well well-sm">
        <h1 class="text-center" style="font-size: 35px;">Notification with Websockets</h1>
    </div>
    <div class="col-sm-4 col-md-4 col-sm-offset-4 col-md-offset-4">
        <form>      
            <div class="form-group">
                <label>Address:</label>
                <input type="text" class="form-control" v-model="enterAddress" required /><br>
                <i>*enter address (40 characters) to start connection </i>
            </div>
        </form>
    </div>

<div id="stream" style="width: 850px;height: 350px;margin: auto;border: 1px solid #444;padding: 20px;overflow: auto;"></div>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Transactions in block <span id="txsHeight"></span></h4>
      </div>
      <div id="txs" class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import nem from 'nem-sdk';

 

export default {
    data () {
        return {
            enterAddress: ''
                }
    },
   
    methods : {
        notify(){

            // Create an NIS endpoint object
            var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

            // Address to subscribe
            //  var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

            var address = '';

            if (this.enterAddress.length == 40) {
                address = this.enterAddress;
            }

            // Create a connector object
            var connector = nem.com.websockets.connector.create(endpoint, address);

            // Set start date of the monitor
            var date = new Date();

            // Add event to the stream div
            $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Starting monitor...</p>');

            // Try to establish a connection
        
            if (address != ''){
                connect(connector);
                console.log('connections was made!');
            }

            // Connect using connector
            function connect(connector) {
            return connector.connect().then(function () {
                // Set time
                date = new Date();

                // If we are here, we are connected
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Connected to: ' + connector.endpoint.host + '</p>');


                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Subscribing to recent transactions</p>');

                // Subscribe to recent transactions channel
                nem.com.websockets.subscribe.account.transactions.recent(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Received recent transactions</p>');
                // Show data
                $('#stream').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(res) + '</pre>');
                console.log('recent transaction', res);
                });

                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Subscribing to account data of ' + connector.address + '</p>');

                // Subscribe to account data channel
                nem.com.websockets.subscribe.account.data(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Received account data</p>');
                // Show data
                $('#stream').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(res) + '</pre>');
                console.log('account data', res);
                });

                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Subscribing to unconfirmed transactions of ' + connector.address + '</p>');

                // Subscribe to unconfirmed transactions channel
                nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Received unconfirmed transaction</p>');
                // Show data
                $('#stream').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(res) + '</pre>');
                console.log('unconfirmed transaction', res);
                });

                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Subscribing to confirmed transactions of ' + connector.address + '</p>');

                // Subscribe to confirmed transactions channel
                nem.com.websockets.subscribe.account.transactions.confirmed(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Received confirmed transaction</p>');
                // Show data
                $('#stream').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(res) + '</pre>');
                console.log('confirmed transaction', res);
                });

                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Requesting account data of ' + connector.address + '</p>');

                // Request account data
                nem.com.websockets.requests.account.data(connector);

                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Requesting recent transactions of ' + connector.address + '</p>');

                // Request recent transactions
                nem.com.websockets.requests.account.transactions.recent(connector);

            }, function (err) {
                // Set time
                date = new Date();
                // Show event
                $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> An error occured</p>');
                // Show data
                $('#stream').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(err) + '</pre>');
                // Try to reconnect
                reconnect();
            });
            }

            function reconnect() {
            // Replace endpoint object
            endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[1].uri, nem.model.nodes.websocketPort);
            // Replace connector
            connector = nem.com.websockets.connector.create(endpoint, address);
            // Set time
            date = new Date();
            // Show event
            $('#stream').append('<p><b>' + date.toLocaleString() + ':</b> Trying to connect to: ' + endpoint.host + '</p>');
            // Try to establish a connection
            connect(connector);
            }
        }
    },
    updated() {
            this.notify();
    }
}
</script>

<style>
</style>

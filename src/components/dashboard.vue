<template>
    <div>

        <div class="well well-sm">
            <h1 class="text-center" style="font-size: 35px;">Dashboard</h1>
        </div>
        <div class="row">
            <div class="col-sm-4 col-md-4 col-sm-offset-4 col-md-offset-4">
                <form>
                    <div class="form-group">
                        <label>Address:</label>
                        <input type="text" class="form-control" v-model="inputAddress" required />
                    </div>
                </form>
            </div>
        </div>

        <div class="text-center">
            <button class="btn btn-primary" v-on:click.prevent="notify">Load Notification</button>
        </div>
        <i> Cannot load asynchronously because of 'Access-Control-Allow-Origin' error</i> 

        <div style="margin-top:15px; font-size:15px; padding-right:200px; padding-left:200px">
            <div class="well" v-if="inputAddress !=''">
                <p>
                    <b> Balance for </b>{{ inputAddress }}:
                    <b> {{ balance }} </b>
                </p>
            </div>
        </div>

        <div style="margin-top:10px; padding: 0 100px;" v-if="inputAddress !=''">
            <!-- <div class="panel panel-default">
                <div class="panel-heading">
                    <b>Confirmed</b>
                </div>
                <div class="panel-body">
                    <b-table striped hover :items="items" :fields="fields"></b-table>
                </div>
            </div> -->
            
    <b-card no-body>
        <b-tabs pills card>
            <b-tab title="Confirmed" active>       
                <b-table striped hover :items="items" :fields="fields"></b-table>
            </b-tab>
            <b-tab title="Unconfirmed">      
                <b-table striped hover :items="unconfirmedData"  :fields="fields"></b-table>
            </b-tab>
        </b-tabs>
    </b-card>

        </div>
    </div>

    </div>
</template>

<script>
import nem from 'nem-sdk';


export default {
    data() {
        return {
            inputAddress: '',
            items: null,
            confirmedData: null,
            unconfirmedData : null,
            balance: null,
            globalEndPoint: null,
            fields: [
                {
                    key: 'timeStamp',
                    label: 'Date',
                    sortable: true
                },
                {
                    key: 'recipient',
                    sortable: false
                },
                {
                    key: 'amount',
                    sortable: false
                },
                {
                    key: 'message',
                    sortable: false
                },
                {
                    key: 'fee',
                    sortable: false
                }
            ],
            unconfirmedFields: [

            ]
        }
    },

    methods: {
        connector(connector) {
            var global = this;
            console.log('inside connector()', this);
            return connector.connect().then(function() {
                var tableData = [];
                var unconfirmedArray = [];
                var confirmedArray  = [];
                console.log('inside promise', global);
                // Subscribe to recent transactions channel
                nem.com.websockets.subscribe.account.transactions.recent(connector, function(res) {
                    console.log('recent-transaction', res);
                    tableData = [];
                    for (var dataIDX = 0; dataIDX < res.data.length; dataIDX++) {
                        tableData.push(res.data[dataIDX].transaction);
                    }
                    global.items = tableData;
                    for (var globalIDX = 0; globalIDX < global.items.length; globalIDX++) {
                        global.items[globalIDX].message = nem.utils.format.hexMessage(global.items[globalIDX].message);
                        global.items[globalIDX].timeStamp = nem.utils.format.nemDate(global.items[globalIDX].timeStamp);

                        // var totalAmount = global.items[globalIDX].amount + global.items[globalIDX].fee;
                        // global.items[globalIDX].amount = nem.utils.format.nemValue(totalAmount).toString() + ' XEM';

                         global.items[globalIDX].amount = nem.utils.format.nemValue(global.items[globalIDX].amount).toString() + ' XEM';
                         global.items[globalIDX].fee = nem.utils.format.nemValue(global.items[globalIDX].fee).toString() + ' XEM';

                    }
                    console.log('global.items', global.items);
                });
                // Subscribe to account data channel
                nem.com.websockets.subscribe.account.data(connector, function(res) {
                    global.balance = nem.utils.format.nemValue(res.account.balance).toString() + ' XEM';
                    console.log('account data', res.account.balance);
                });

                // Subscribe to unconfirmed transactions channel
                nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, function(res) {
                    global.unconfirmedData = [res.transaction];
                    global.unconfirmedData[0].message = nem.utils.format.hexMessage(global.unconfirmedData[0].message);
                    global.unconfirmedData[0].timeStamp = nem.utils.format.nemDate(global.unconfirmedData[0].timeStamp);
                    global.unconfirmedData[0].amount = nem.utils.format.nemValue(global.unconfirmedData[0].amount).toString() + ' XEM';
                    global.unconfirmedData[0].fee = nem.utils.format.nemValue(global.unconfirmedData[0].fee).toString() + ' XEM';
                     alert("There is unconfirmed transaction, see unconfirmed tabs for details");
                    console.log('unconfirmed transaction', res);
                    console.log('global.unconfirmedData', global.unconfirmedData[0]);
                });

                // Subscribe to confirmed transactions channel
                nem.com.websockets.subscribe.account.transactions.confirmed(connector, function(res) {
                    global.confirmedData = [res.transaction];
                    alert("Your recent transaction is confirmed!");
                    console.log('confirmed transaction', res);
                    console.log('global.confirmedData', global.confirmedData);
                });

                // Request account data
                nem.com.websockets.requests.account.data(connector);

                // Request recent transactions
                nem.com.websockets.requests.account.transactions.recent(connector);

            }, function(err) {
                // Try to reconnect
                // Replace endpoint object
                var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[1].uri, nem.model.nodes.websocketPort);
                
                // Replace connector
                connector = nem.com.websockets.connector.create(endpoint, global.inputAddress);
                global.connector(connector);
            });

        },
        notify: function() {
            console.log('inside notify', this);

            // Create an NIS endpoint object
            var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);

            // Address to subscribe
            //  var address = "TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S";

            var address = '';

            if (this.inputAddress.length == 40) {
                address = this.inputAddress;
            }

            // Create a connector object
            var connector = nem.com.websockets.connector.create(endpoint, address);

            // Try to establish a connection

            if (address != '') {
                this.connector(connector);
                console.log('connection function was called!');
            }
        }
    },
    updated() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
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
</style>

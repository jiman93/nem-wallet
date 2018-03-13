<template>
<div>
    <div class="well well-sm">
        <h1 class="text-center" style="font-size: 35px;">Send</h1>
    </div>
    <div class="row">
    <div class="col-sm-4 col-md-4 col-sm-offset-4 col-md-offset-4">
        <form>      
            <div class="form-group">
                <label>Recipient:</label>
                <input type="text" class="form-control" v-model="send.recipient" placeholder="Address" required />
            </div>
            <div class="form-group">
                <label>Amount:</label>
                <input type="text" class="form-control" v-model="send.amount" placeholder="XEM" required />
            </div>
            <div class="form-group">
                <label>Message:</label>
                <textarea v-model="send.message" class="form-control"></textarea>
            </div>
            <div class="form-group well well-sm">
                <label>Fee:</label>
                {{this.send.fee}}
            </div>
            <div class="form-group">
                <label>Private Key:</label>
                <input type="text" class="form-control"v-model="send.privateKey" required />
            </div>
            <button class="btn btn-primary" v-on:click.prevent="sendRequest">Send</button>
        </form>   
    </div>
    </div>
</div>
</template>

<script>
// Imports
import nem from 'nem-sdk';


export default {
    data () {
        return {
            send: {
                recipient: '',
                amount: '',
                message: '',
                fee: '',
                privateKey: ''
            },
            common: null,
            endpoint: null,
            transferTransaction: null
        }
    },
    methods: {
          createObject() {
                // Create an NIS endpoint object
                this.endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
                console.log("endpoint", this.endpoint);

                // Get an empty un-prepared transfer transaction object
                this.transferTransaction = nem.model.objects.get("transferTransaction");
                console.log("transferTransaction", this.transferTransaction);

                // Get an empty common object to hold pass and key
                this.common = nem.model.objects.get("common");
                console.log("common", this.common);
            },
         sendRequest: function(){
            console.log("send", this.send);
            //Check form for errors
            if (this.send.privateKey === '' || this.send.recipient === '') return alert('Missing parameter !');

            if ('' === this.send.amount || !nem.utils.helpers.isTextAmountValid(this.send.amount)) return alert('Invalid amount !');
            // if (!nem.model.address.isValid(nem.model.address.clean(this.formObject.recipient))) return alert('Invalid recipent address !');

            // Set the private key in common object
            this.common.privateKey = this.send.privateKey;

            // Check private key for errors
            if (this.common.privateKey.length !== 64 && this.common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
            if (!nem.utils.helpers.isHexadecimal(this.common.privateKey)) return alert('Private key must be hexadecimal only !');

            // Set the cleaned amount into transfer transaction object
            this.transferTransaction.amount = nem.utils.helpers.cleanTextAmount(this.send.amount);

            // Recipient address must be clean (no hypens: "-")
            this.transferTransaction.recipient = nem.model.address.clean(this.send.recipient);

            // Set message
            this.transferTransaction.message = this.send.message;

            console.log('send', this.send);  
            console.log('send-this.transferTransaction', this.transferTransaction);
            console.log('send-nem.model.network.data.testnet.id', nem.model.network.data.testnet.id);

            // Prepare the updated transfer transaction object
            var transactionEntity = nem.model.transactions.prepare("transferTransaction")(this.common, this.transferTransaction, nem.model.network.data.testnet.id);

            // Serialize transfer transaction and announce
            nem.model.transactions.send(this.common, transactionEntity, this.endpoint).then(function (res) {
                // If code >= 2, it's an error
                if (res.code >= 2) {
                alert(res.message);
                console.log('error message', res.message)
                } else {
                alert(res.message);
                console.log('successful message', res.message);
                }
            }, function (err) {
                alert(err);
                console.log('request error message', err);
            });
            },
               updateFee() {

        // Check for amount errors
            if (undefined === this.send.amount || !nem.utils.helpers.isTextAmountValid(this.send.amount)) return alert('Invalid amount !');

        // Set the cleaned amount into transfer transaction object
            this.transferTransaction.amount = nem.utils.helpers.cleanTextAmount(this.send.amount);

        // Set the message into transfer transaction object
            this.transferTransaction.message = this.send.message;

        // Prepare the updated transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(this.common, this.transferTransaction, nem.model.network.data.testnet.id);

        // Format fee returned in prepared object
        var feeString = nem.utils.format.nemValue(transactionEntity.fee)[0] + "." + nem.utils.format.nemValue(transactionEntity.fee)[1];

        //Set fee in view
        this.send.fee = feeString;
        console.log("this.send", this.send);
               }

    },
    computed: {
     
        
    },
    created() {
        this.createObject();
        this.updateFee();
    },
    updated() {
        // Set the cleaned amount into transfer transaction object
            this.transferTransaction.amount = nem.utils.helpers.cleanTextAmount(this.send.amount);

        // Set the message into transfer transaction object
            this.transferTransaction.message = this.send.message;

        // Prepare the updated transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(this.common, this.transferTransaction, nem.model.network.data.testnet.id);

        // Format fee returned in prepared object
        var feeString = nem.utils.format.nemValue(transactionEntity.fee)[0] + "." + nem.utils.format.nemValue(transactionEntity.fee)[1];

        //Set fee in view
        this.send.fee = feeString;
    }

}
</script>

<style scoped>  
</style>

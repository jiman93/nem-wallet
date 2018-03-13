<template>
<div>
    <div class="well well-sm">
        <h1 class="text-center" style="font-size: 35px;">Receive with Invoice</h1>
    </div>
    <div class="col-sm-4 col-md-4 col-sm-offset-4 col-md-offset-4">
        <form>      
            <div class="form-group">
                <label>Address:</label>
                <input type="text" class="form-control" v-model="address" required />
            </div>
            <div class="form-group">
                <label>Amount:</label>
                <input type="text" class="form-control" v-model="amount" required placeholder="XEM"/>
            </div>
            <div class="form-group">
                <label>Message:</label>
               <textarea v-model="message" class="form-control"></textarea>
            </div>
        </form>   
        <hr>
         <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
    </div>
</div>
</template>

<script>
import nem from 'nem-sdk';
import QrcodeVue from 'qrcode.vue';

export default {
    data () {
        return {
            endpoint : null,
            address: null,
            amount: null,
            message: null,
            value: '',
            size: 170
                }
    },
      components: {
            QrcodeVue
    },
    methods : {
        createObject() {
            this.endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
        }
    },
    created() {
       this.createObject();
    },
    updated() {
        console.log('address', this.address);
        console.log('receive-endpoint', this.endpoint);
        this.value = "data:{ addr: " + this.address.toString() +", amount: "+ this.amount +", msg: " +this.message + ", name: NanoWallet XEM invoice}";
    }

}
</script>

<style>
</style>

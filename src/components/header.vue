<template>
    <nav>
        <ul>
            <li><router-link to="/" exact>Dashboard</router-link></li>
            <li><router-link to="/send" exact>Send</router-link></li>
            <li><router-link to="/receive" exact>Receive</router-link></li>
            <li><a href="https://bitbucket.org/zulhafiz06/luxtag-dev-init" target="_blank"><i class="fa fa-github fa-lg" aria-hidden="true"></i></a></li>
        </ul>
    </nav>
</template>

<script>
export default {}
</script>

<style scoped>
ul{
    list-style-type: none;
    text-align: center;
    margin: 0;
}
li{
    display: inline-block;
    margin: 0 10px;
}
a{
    color: #fff;
    text-decoration: none;
    padding: 6px 8px;
    border-radius: 10px;
}
nav{
    background: #444;
    padding: 14px 0;
    margin-bottom: 10px;
}
.router-link-active{
    background: #eee;
    color: #444;
}
</style>

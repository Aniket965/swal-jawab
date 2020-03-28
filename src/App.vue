<template>
  <div id="app">
 <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',

};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,700,800,900&display=swap');
$body-font-family: "Poppins" !important;
html,body {
  margin:0;
  padding: 0;
  scroll-behavior: smooth;
  
}
.mt-5 {
    margin-top: 5rem;
}
.mt-4 {
    margin-top: 4rem;
}
.mt-3 {
  margin-top: 3rem;
}
.mt-2 {
  margin-top: 2rem;
}
.mt-1 {
  margin-top: 1rem;
}
.no-deco {
text-decoration: none ;
color: inherit;
}
.no-deco:hover {
    color:inherit;
    text-decoration:none;
    cursor:pointer;
}
.emptyspace {
  width: 100%;
  height: 2rem;
}
.center-child {
  display: flex;
  justify-content: center;
  align-items: center;
}
:root {
  --primaryColor: #FF084E;
  --secondaryColor: #D7003D;
  --darkColor:black;
  --backgroundColor:white;
  --fontFamily:'Poppins', sans-serif!important;
}

#app {
  font-family: 'Poppins', sans-serif!important; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--darkColor);
  margin-top: 60px;
}
</style>

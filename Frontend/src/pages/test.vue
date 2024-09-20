<template>
    <!-- <div class="w-1/12 absolute top-16 right-0 justify-center items-center z-30 button mr-3">
    <button @click="isOpen = !isOpen">選項</button>
    <ul v-if="isOpen">
      <li v-for="item in items" :key="item.id" class="selection">
        {{ item.name }}
      </li>
    </ul>
  </div> -->
  <div class="w-1/12 absolute top-16 right-0 justify-center items-center z-30 button mr-3">
    <div>
      <button @click="isOpen = !isOpen">選項</button>
      <ul v-if="isOpen">
        <li v-for="item in options" :key="item.index">
          <button @click="update(item.index)"   class="selection" >{{ item.text }}</button>
        </li>
      </ul>
    </div>
    <p class="pt-10">Selected: {{ selected + 1}}</p>
    <!-- <p>data: {{options[0].data[0]}}</p> -->
  </div>
</template>

<script lang ="ts">

import axios from 'axios';

export default {
  name: "Sidebar",
  data() {
    return {
      isOpen: false,
      selected: 1,
      options: [
        { text: '家暴', value: 'option1', index: 0, data: []},
        { text: '車禍死傷', value: 'option2', index: 1, data: [] },
        { text: '身心障礙機構', value: 'option3', index: 2, data: [] },
      ],
    };
  },
  mounted(){
    axios.get('http://34.230.89.214/Data1')
      .then((response) => {
        //console.log(response.data);
          this.options[0].data = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get('http://34.230.89.214/Data2')
      .then((response) => {
        //console.log(response.data);
        this.options[1].data = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    
    axios.get('http://34.230.89.214/Data3')
      .then((response) => {
        //console.log(response.data);
        this.options[2].data = response.data;
      })
      .catch((err) => {
        console.log(err);
      })
    setTimeout(updateDB, 1800000);
  },
  props:{
    getOptionData: Function,
  },
  methods :{
    update(index : number){
      this.selected = index;
      this.$emit('event', this.options[this.selected].data)
    }
  }
};

function updateDB(){
  axios.delete('http://34.230.89.214:8000/deleteData')
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  axios.post('http://34.230.89.214:8000/updateData1')
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  axios.post('http://34.230.89.214:8000/updateData2')
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  axios.post('http://34.230.89.214:8000/updateData3')
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
}

</script>

<style>
    .button{
        background: #e2b65d;
        border: 3px solid #ba683d;
        border-radius: 8px;
        font-family: 'Microsoft JhengHei';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 16px;

        padding-left: 10px;
        padding-right: 10px;
        padding-top: 4px;
        padding-bottom: 12px;

        color: #692e1d;

        box-sizing: border-box;
        height: 2em;
        text-align: center;
    }
    .selection{
        padding-top: 12px;
        padding-bottom: 2px;
    }
</style>
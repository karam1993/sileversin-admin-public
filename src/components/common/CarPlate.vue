<template>
  <div class="carPlate">
    <span class="tr">TR</span>
    <span class="number">
      <span>{{ plate[0] }}</span>
      <span>{{ plate[1] }}</span>
      <span>{{ plate[2] }}</span>  
    </span>
  </div>
</template>

<script>
export default {
  props: {
    plate: {
      type: Array,
      default: null
    }
  }
}
</script>
<style>

.carPlate{
    border: 1px solid black;
    display: inline-block;
    padding: 5px;
    border-radius: 5px;
    position: relative;
    color: black;
    background-color: #fff;
}
.carPlate .tr {
    color: #fff;
    background: blue;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    font-size: 8px;
    width: 15px;
    text-align: center;
    padding-top: 10px;
    border-radius: 4px 0 0 4px;
}
.carPlate .number{
    padding-left : 15px;
    padding-right: 3px;
    direction: ltr;
    display: inline-block;
}

</style>
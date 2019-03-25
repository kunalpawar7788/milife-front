<template>
<input v-model="text" />
</template>

<script>
export default{
    name: 'CustomInput',
    props: ['value', 'suffix',],
    data() {
        return {local: this.value,};
    },
    computed: {
        text: {
            get() {
                this.local = this.value;
                return this.value + this.suffix;
            },
            set(newvalue){
                //var regex = "/(" + this.suffix +")$/";
                var retval = newvalue.replace(this.suffix, "");
                if (Number(retval) === NaN) {
                    retval = this.local;
                }

                this.$emit('input', retval);
            }
        },
    },

}
</script>

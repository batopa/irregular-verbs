<template>
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
        <div class="mx-auto sm:px-6 lg:px-8">
            <h2 class="flex justify-center text-2xl">Irregular Verbs</h2>
            <form>
                <div class="grid grid-cols-4 gap-4 mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                    <div>Base Form</div>
                    <div>Past Simple</div>
                    <div class="col-span-2">Past Participle</div>
                    <input type="text"
                        class="text-gray-900 border border-gray-400 rounded-md py-3 px-4 focus:border-blue-500"
                        :class="{
                            'ring-offset-2 ring ring-green-500': known !== 'base' && ok !== null && baseResult,
                            'ring-offset-2 ring ring-red-600': known !== 'base' && ok !== null && !baseResult,
                            'border-0 bg-white text-2xl px-0': known === 'base',
                        }"
                        placeholder="Base form"
                        :disabled="known === 'base' ? 'disabled' : false"
                        v-model="base"
                        @keydown="ok = null"
                    />
                    <input type="text"
                        class="text-gray-900 border border-gray-400 rounded-md py-3 px-4 focus:border-blue-500"
                        :class="{
                            'ring-offset-2 ring ring-green-500': known !== 'past' && ok !== null && pastResult,
                            'ring-offset-2 ring ring-red-600': known !== 'past' && ok !== null && !pastResult,
                            'border-0 bg-white text-2xl px-0': known === 'past',
                        }"
                        placeholder="Past simple"
                        :disabled="known === 'past' ? 'disabled' : false"
                        v-model="past"
                        @keydown="ok = null"
                    />
                    <input type="text"
                        class="text-gray-900 border border-gray-400 rounded-md py-3 px-4 focus:border-blue-500"
                        :class="{
                            'ring-offset-2 ring ring-green-500': known !== 'participle' && ok !== null && participleResult,
                            'ring-offset-2 ring ring-red-600': known !== 'participle' && ok !== null && !participleResult,
                            'border-0 bg-white text-2xl px-0': known === 'participle',
                        }"
                        placeholder="Past participle"
                        :disabled="known === 'participle' ? 'disabled' : false"
                        v-model="participle"
                        @keydown="ok = null"
                    />
                    <button
                        class="p-3 rounded-md bg-blue-500 hover:bg-blue-700 text-zinc-100 disabled:opacity-50"
                        :disabled="ok === true ? 'disabled' : false"
                        @click.prevent="check"
                    >Check it</button>


                    <div>
                        <div v-if="ok === true" class="mt-5">
                            Good job!
                            <button class="p-2 ml-3 p-3 rounded-md bg-blue-500 hover:bg-blue-700 text-zinc-100" @click="next()">Next</button>
                        </div>
                        <div v-if="ok === false">No, no, no.... try again!</div>
                    </div>

                    <div class="col-start-4 flex flex-col text-lg">
                        <span>Attempts: {{ total }}</span>
                        <span class="text-red-500">Errors: {{ errors }}</span>
                        <span class="text-green-500">Success: {{ percentage }}%</span>
                    </div>
                </div>
            </form>

            <div class="flex justify-center pt-4 space-x-2 text-sm text-gray-400">
                Made with <span class="text-red-600 ml-1 mr-1">♥</span> by <a href="https://github.com/batopa" target="_blank">bato</a>
            </div>
        </div>
    </div>
</template>

<script>
import { verbs } from '../config/config.js';

export default {
    name: 'IndexPage',

    data: function() {
        return {
            verbs: [],
            base: null,
            past: null,
            participle: null,
            current: { base: null, past: null, participle: null },
            known: null,
            ok: null,
            total: 0,
            errors: 0,
            correct: 0,
        };
    },

    computed: {
        baseResult: function() {
            return this.base === this.current.base;
        },

        pastResult: function() {
            if (Array.isArray(this.current.past)) {
                return this.current.past.includes(this.past);
            }

            return this.past === this.current.past;
        },

        participleResult: function() {
            if (Array.isArray(this.current.participle)) {
                return this.current.participle.includes(this.participle);
            }

            return this.participle === this.current.participle;
        },

        percentage: function() {
            if (this.total === 0) {
                return 0;
            }

            return Math.round((this.correct / this.total) * 100);
        },
    },

    mounted() {
        this.init();
        this.$nextTick(() => this.focus());
    },

    methods: {
        init(resetVerbs = true) {
            if (resetVerbs) {
                this.verbs = [ ...verbs ];
                this.shuffle(this.verbs);
            }

            this.ok = null;
            this.base = null;
            this.past = null;
            this.participle = null;
            this.current = this.verbs.shift();

            this.known = this.shuffle(['base', 'past', 'participle']).shift();
            let val = this.current[this.known];
            if (Array.isArray(val)) {
                val = this.shuffle([ ...val ]).shift();
            }
            this[this.known] = val;
        },

        focus() {
            document.querySelector('input[type=text]:not([disabled=disabled]').focus();
        },

        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }

            return array;
        },

        check() {
            this.total++;
            this.base = this.base && this.base.toLowerCase().trim();
            this.past = this.past && this.past.toLowerCase().trim();
            this.participle = this.participle && this.participle.toLowerCase().trim();
            if (this.baseResult && this.pastResult && this.participleResult) {
                this.ok = true;
                this.correct++;

                return;
            }

            this.ok = false;
            this.errors++;
        },

        next() {
            let reset = false;
            if (this.verbs.length === 0) {
                reset = true;
            }
            this.init(reset);
            this.$nextTick(() => this.focus());
        },
    },
}
</script>

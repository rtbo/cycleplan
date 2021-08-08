<template>
  <span
    v-if="!editing && !forceEditing"
    @mouseover="showPencil = true"
    @mouseleave="showPencil = false"
    class="inline-flex cursor-pointer"
    :class="spanFlexClass"
    @click="startEditing"
  >
    {{ modelValue }}
    <app-icon-button v-show="showPencil" icon="mdi:pencil"></app-icon-button>
  </span>
  <span
    v-else
    @mouseover="showPencil = true"
    @mouseleave="showPencil = false"
    class="flex flex-row flex-nowrap"
  >
    <app-input
      class="flex-shrink w-full"
      :class="computedInputClass"
      v-model="editValue"
      type="text"
      @keydown.esc="cancelEdit"
      @keyup.enter="applyEdit"
      v-focus
    />
    <app-icon-button
      @click="applyEdit"
      :disabled="!valid"
      icon="mdi:keyboard-return"
    />
    <app-icon-button @click="cancelEdit" icon="mdi:keyboard-esc" />
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref } from "vue";
import { ensureArray } from "@/util";

export default defineComponent({
  props: {
    modelValue: [String, Number],
    inputClass: [String, Array],
    validate: Function,
    forceEditing: Boolean,
    pencilBefore: Boolean,
    keepPencilSpace: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const editing = ref(false);
    const showPencil = ref(false);
    const editValue: Ref<string | number> = ref("");

    const valid = computed(() => {
      if (!props.validate) {
        return true;
      }
      return props.validate(editValue.value);
    });

    const startEditing = () => {
      editValue.value = props.modelValue || "";
      editing.value = true;
    };

    const applyEdit = () => {
      if (!valid.value) return;
      emit("update:modelValue", editValue.value);
      editing.value = false;
    };

    const cancelEdit = () => {
      nextTick(() => {
        console.log("cancel edit next tick");
        editing.value = false;
      });
    };

    const spanFlexClass = computed(() =>
      props.pencilBefore ? "flex-row-reverse" : "flex-row"
    );

    const validRuleClass = computed(() => (valid.value ? [] : ["text-error"]));

    const computedInputClass = computed(() => [
      ...validRuleClass.value,
      ...ensureArray(props.inputClass),
    ]);

    return {
      editing,
      showPencil,
      editValue,
      valid,
      startEditing,
      applyEdit,
      cancelEdit,
      spanFlexClass,
      computedInputClass,
    };
  },
});
</script>

import { SectionDef } from './Section';
import { ContainerDef } from './Container';
import { DividerDef } from './Divider';
import { SpacerDef } from './Spacer';

import { NavbarDef } from './Navbar';
import { FooterDef } from './Footer';

import { HeadingDef } from './Heading';
import { ParagraphDef } from './Paragraph';
import { BadgeDef } from './Badge';

import { ButtonDef } from './Button';
import { TextInputDef } from './TextInput';
import { TextareaDef } from './Textarea';
import { NumberInputDef } from './NumberInput';
import { SelectDropdownDef } from './SelectDropdown';
import { SearchBoxDef } from './SearchBox';
import { CheckboxDef } from './Checkbox';
import { RadioDef } from './Radio';

import { ImageComponentDef } from './ImageComponent';
import { IconComponentDef } from './IconComponent';

import { CardDef } from './Card';
import { HeroSectionDef } from './HeroSection';
import { CTABlockDef } from './CTABlock';
import { FeatureBlockDef } from './FeatureBlock';

export const componentLibrary = [
  SectionDef,
  ContainerDef,
  DividerDef,
  SpacerDef,

  NavbarDef,
  FooterDef,

  HeadingDef,
  ParagraphDef,
  BadgeDef,

  ButtonDef,
  TextInputDef,
  TextareaDef,
  NumberInputDef,
  SelectDropdownDef,
  SearchBoxDef,
  CheckboxDef,
  RadioDef,

  ImageComponentDef,
  IconComponentDef,

  CardDef,
  HeroSectionDef,
  CTABlockDef,
  FeatureBlockDef,
];

export const getComponentDef = (type) => componentLibrary.find((comp) => comp.type === type);

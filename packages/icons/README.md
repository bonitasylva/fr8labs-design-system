# sandbox-fds-icons

Fr8Labs icons for React applications, independently consumable from the component package.

```tsx
import {Icon} from 'sandbox-fds-icons';
import 'sandbox-fds-icons/styles.css';

<Icon name="download" />
<Icon name="close" size={16} />
```

Icons use Material Symbols Sharp at weight 300, grade 0, and the 20 optical master. They render at 20px by default; use `size={16}` for compact contexts. Icons are decorative by default. Pass `label` only when the icon itself must carry meaning.

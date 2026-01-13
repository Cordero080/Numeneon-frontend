# SearchModal.scss Reference

Key mobile media query to add:

```scss
@media (max-width: 768px) {
  .search-modal-overlay {
    padding-left: 70px; /* Account for 56px side nav + some margin */
    padding-right: 15px;
    padding-top: 5vh;
  }

  .search-modal {
    max-height: 80vh;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .search-modal-overlay {
    padding-left: 0;
    padding-top: 0;
    align-items: flex-start;
  }
}
```

This adjustment centers the search modal properly when the mobile slide-out sidenav is present.

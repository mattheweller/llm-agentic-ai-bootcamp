# Fine-Tuned LoRA Models

This directory contains fine-tuned LoRA adapter weights for the sentiment analysis example.

## Pre-trained Model

The pre-trained sentiment analysis LoRA adapter (`sentiment_finetuned_adapter_epoch_4.zip`, 174 MB) is too large for GitHub's standard file size limits.

### Option 1: Train Your Own (Recommended)

Follow the instructions in `fine-tuning-peft-lora.ipynb` to train your own LoRA adapter on Google Colab. This is the best way to learn the fine-tuning process.

### Option 2: Download Pre-trained Adapter

If you want to skip training and use the pre-trained adapter:

1. **Google Drive (if available):** [Link to be added]
2. **Hugging Face Hub (alternative):** [Link to be added]
3. **Train it yourself:** Run the notebook on Google Colab (recommended for learning)

### File Structure

After training or downloading, your directory should look like:

```
fine-tuning-lora/models/
├── README.md (this file)
└── sentiment_finetuned_adapter_epoch_4.zip  (174 MB - not in git)
```

## Note

Large model files are excluded from git tracking to keep the repository lightweight. See `.gitignore` in the repository root.

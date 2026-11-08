#!/bin/bash

# A script to replace lucide-react icons with @iconify/react icons

replace_in_file() {
  local file=$1
  sed -i "s/import {.*} from 'lucide-react';/import { Icon } from '@iconify\/react';/g" "$file"
  
  # Replace components
  sed -i 's/<Save\b[^>]*>/<Icon icon="hugeicons:floppy-disk" width={18} \/>/g' "$file"
  sed -i 's/<Save size={\([^}]*\)} \/>/<Icon icon="hugeicons:floppy-disk" width={\1} \/>/g' "$file"
  
  sed -i 's/<AlertCircle\b[^>]*>/<Icon icon="hugeicons:alert-02" width={18} \/>/g' "$file"
  sed -i 's/<AlertCircle size={\([^}]*\)} \/>/<Icon icon="hugeicons:alert-02" width={\1} \/>/g' "$file"
  
  sed -i 's/<CheckCircle\b[^>]*>/<Icon icon="hugeicons:check-circle" width={18} \/>/g' "$file"
  sed -i 's/<CheckCircle size={\([^}]*\)} \/>/<Icon icon="hugeicons:check-circle" width={\1} \/>/g' "$file"
  
  sed -i 's/<Plus\b[^>]*>/<Icon icon="hugeicons:plus-sign" width={18} \/>/g' "$file"
  sed -i 's/<Plus size={\([^}]*\)} \/>/<Icon icon="hugeicons:plus-sign" width={\1} \/>/g' "$file"
  
  sed -i 's/<Edit2\b[^>]*>/<Icon icon="hugeicons:pencil-edit-02" width={18} \/>/g' "$file"
  sed -i 's/<Edit2 size={\([^}]*\)} \/>/<Icon icon="hugeicons:pencil-edit-02" width={\1} \/>/g' "$file"
  
  sed -i 's/<Users\b[^>]*>/<Icon icon="mynaui:users" width={18} \/>/g' "$file"
  sed -i 's/<Users size={\([^}]*\)} \/>/<Icon icon="mynaui:users" width={\1} \/>/g' "$file"
  
  sed -i 's/<FolderPlus\b[^>]*>/<Icon icon="hugeicons:folder-add" width={18} \/>/g' "$file"
  sed -i 's/<FolderPlus size={\([^}]*\)} \/>/<Icon icon="hugeicons:folder-add" width={\1} \/>/g' "$file"
  
  sed -i 's/<ActivityIcon\b[^>]*>/<Icon icon="hugeicons:activity-01" width={18} \/>/g' "$file"
  sed -i 's/<ActivityIcon size={\([^}]*\)} \/>/<Icon icon="hugeicons:activity-01" width={\1} \/>/g' "$file"
  
  sed -i 's/<Activity\b[^>]*>/<Icon icon="hugeicons:activity-01" width={18} \/>/g' "$file"
  sed -i 's/<Activity size={\([^}]*\)} \/>/<Icon icon="hugeicons:activity-01" width={\1} \/>/g' "$file"
  
  sed -i 's/<Trash2\b[^>]*>/<Icon icon="hugeicons:delete-02" width={18} \/>/g' "$file"
  sed -i 's/<Trash2 size={\([^}]*\)} \/>/<Icon icon="hugeicons:delete-02" width={\1} \/>/g' "$file"
  
  sed -i 's/<Check\b[^>]*>/<Icon icon="hugeicons:checkmark" width={18} \/>/g' "$file"
  sed -i 's/<Check size={\([^}]*\)} \/>/<Icon icon="hugeicons:checkmark" width={\1} \/>/g' "$file"
  
  sed -i 's/<X\b[^>]*>/<Icon icon="mynaui:x" width={18} \/>/g' "$file"
  sed -i 's/<X size={\([^}]*\)} \/>/<Icon icon="mynaui:x" width={\1} \/>/g' "$file"
  
  sed -i 's/<UserIcon\b[^>]*>/<Icon icon="hugeicons:user-circle-02" width={18} \/>/g' "$file"
  sed -i 's/<UserIcon size={\([^}]*\)} \/>/<Icon icon="hugeicons:user-circle-02" width={\1} \/>/g' "$file"
  
  sed -i 's/<User\b[^>]*>/<Icon icon="hugeicons:user-circle-02" width={18} \/>/g' "$file"
  sed -i 's/<User size={\([^}]*\)} \/>/<Icon icon="hugeicons:user-circle-02" width={\1} \/>/g' "$file"
  
  sed -i 's/<Award\b[^>]*>/<Icon icon="hugeicons:award-01" width={18} \/>/g' "$file"
  sed -i 's/<Award size={\([^}]*\)} \/>/<Icon icon="hugeicons:award-01" width={\1} \/>/g' "$file"
  
  sed -i 's/<TrendingUp\b[^>]*>/<Icon icon="hugeicons:trending-up-01" width={18} \/>/g' "$file"
  sed -i 's/<TrendingUp size={\([^}]*\)} \/>/<Icon icon="hugeicons:trending-up-01" width={\1} \/>/g' "$file"
  
  sed -i 's/<Clock\b[^>]*>/<Icon icon="mynaui:clock-circle" width={18} \/>/g' "$file"
  sed -i 's/<Clock size={\([^}]*\)} \/>/<Icon icon="mynaui:clock-circle" width={\1} \/>/g' "$file"
  
  sed -i 's/<Star\b[^>]*>/<Icon icon="material-symbols:star-rate-rounded" width={18} \/>/g' "$file"
  sed -i 's/<Star size={\([^}]*\)} \/>/<Icon icon="material-symbols:star-rate-rounded" width={\1} \/>/g' "$file"
  
  sed -i 's/<Bell\b[^>]*>/<Icon icon="solar:bell-outline" width={18} \/>/g' "$file"
  sed -i 's/<Bell size={\([^}]*\)} \/>/<Icon icon="solar:bell-outline" width={\1} \/>/g' "$file"
  
  sed -i 's/<Info\b[^>]*>/<Icon icon="hugeicons:information-circle" width={18} \/>/g' "$file"
  sed -i 's/<Info size={\([^}]*\)} \/>/<Icon icon="hugeicons:information-circle" width={\1} \/>/g' "$file"
  
  sed -i 's/<Send\b[^>]*>/<Icon icon="hugeicons:sent" width={18} \/>/g' "$file"
  sed -i 's/<Send size={\([^}]*\)} \/>/<Icon icon="hugeicons:sent" width={\1} \/>/g' "$file"
  
  sed -i 's/<Lock\b[^>]*>/<Icon icon="hugeicons:lock-key" width={18} \/>/g' "$file"
  sed -i 's/<Lock size={\([^}]*\)} \/>/<Icon icon="hugeicons:lock-key" width={\1} \/>/g' "$file"
  
  sed -i 's/<Camera\b[^>]*>/<Icon icon="hugeicons:camera-01" width={18} \/>/g' "$file"
  sed -i 's/<Camera size={\([^}]*\)} \/>/<Icon icon="hugeicons:camera-01" width={\1} \/>/g' "$file"
  
  sed -i 's/<Loader2\b[^>]*>/<Icon icon="hugeicons:loading-02" width={18} className="animate-spin" \/>/g' "$file"
  sed -i 's/<Loader2 size={\([^}]*\)} \/>/<Icon icon="hugeicons:loading-02" width={\1} className="animate-spin" \/>/g' "$file"
  
  sed -i 's/<Search\b[^>]*>/<Icon icon="mynaui:search" width={18} \/>/g' "$file"
  sed -i 's/<Search size={\([^}]*\)} \/>/<Icon icon="mynaui:search" width={\1} \/>/g' "$file"
  
  sed -i 's/<ArrowRight\b[^>]*>/<Icon icon="oui:arrow-right" width={18} \/>/g' "$file"
  sed -i 's/<ArrowRight size={\([^}]*\)} \/>/<Icon icon="oui:arrow-right" width={\1} \/>/g' "$file"
  
  sed -i 's/<ShieldCheck\b[^>]*>/<Icon icon="hugeicons:shield-check" width={18} \/>/g' "$file"
  sed -i 's/<ShieldCheck size={\([^}]*\)} \/>/<Icon icon="hugeicons:shield-check" width={\1} \/>/g' "$file"
  
  sed -i 's/<HeartHandshake\b[^>]*>/<Icon icon="hugeicons:handshake" width={18} \/>/g' "$file"
  sed -i 's/<HeartHandshake size={\([^}]*\)} \/>/<Icon icon="hugeicons:handshake" width={\1} \/>/g' "$file"
  
  sed -i 's/<Lightbulb\b[^>]*>/<Icon icon="hugeicons:light-bulb" width={18} \/>/g' "$file"
  sed -i 's/<Lightbulb size={\([^}]*\)} \/>/<Icon icon="hugeicons:light-bulb" width={\1} \/>/g' "$file"
  
  sed -i 's/<Mountain\b[^>]*>/<Icon icon="hugeicons:mountain" width={18} \/>/g' "$file"
  sed -i 's/<Mountain size={\([^}]*\)} \/>/<Icon icon="hugeicons:mountain" width={\1} \/>/g' "$file"
}

for file in src/components/*.tsx src/lib/*.ts; do
  replace_in_file "$file"
done

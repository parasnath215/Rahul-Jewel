import os
import glob
from PIL import Image, ImageFilter, ImageEnhance

def upscale_image(file_path, scale=2):
    try:
        with Image.open(file_path) as img:
            orig_w, orig_h = img.size
            
            # Don't upscale if already high resolution (e.g. > 1200px)
            if orig_w >= 1000 or orig_h >= 1000:
                print(f"Skipping already large image ({orig_w}x{orig_h}): {file_path}")
                return False
                
            new_w = int(orig_w * scale)
            new_h = int(orig_h * scale)
            
            is_png = file_path.lower().endswith('.png')
            
            if img.mode == 'RGBA':
                r, g, b, a = img.split()
                rgb = Image.merge('RGB', (r, g, b))
                
                # 1. Lanczos high-order sinc interpolation
                rgb_resized = rgb.resize((new_w, new_h), Image.Resampling.LANCZOS)
                a_resized = a.resize((new_w, new_h), Image.Resampling.LANCZOS)
                
                # 2. Refined Unsharp Mask on RGB to restore edge crispness and sparkle
                rgb_sharp = rgb_resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=125, threshold=2))
                
                # 3. Micro-contrast enhancement for gold & diamonds
                enhancer = ImageEnhance.Contrast(rgb_sharp)
                rgb_final = enhancer.enhance(1.03)
                
                # Re-merge channels with pristine transparent alpha
                r_f, g_f, b_f = rgb_final.split()
                final_img = Image.merge('RGBA', (r_f, g_f, b_f, a_resized))
                final_img.save(file_path, 'PNG', optimize=True)
                
            elif img.mode == 'RGB':
                rgb_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                rgb_sharp = rgb_resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=125, threshold=2))
                enhancer = ImageEnhance.Contrast(rgb_sharp)
                final_img = enhancer.enhance(1.02)
                
                if is_png:
                    final_img.save(file_path, 'PNG', optimize=True)
                else:
                    final_img.save(file_path, 'JPEG', quality=95, subsampling=0)
            else:
                converted = img.convert('RGB')
                rgb_resized = converted.resize((new_w, new_h), Image.Resampling.LANCZOS)
                rgb_sharp = rgb_resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=125, threshold=2))
                if is_png:
                    rgb_sharp.save(file_path, 'PNG', optimize=True)
                else:
                    rgb_sharp.save(file_path, 'JPEG', quality=95, subsampling=0)
                    
            print(f"Upscaled: {file_path} ({orig_w}x{orig_h} -> {new_w}x{new_h})")
            return True
    except Exception as e:
        print(f"Error upscaling {file_path}: {e}")
        return False

def main():
    target_dirs = [
        'assets/Fancy Chains',
        'assets/Bangles',
        'assets/Rings',
        'assets/Studs',
        'assets/Bracelets',
        'assets/Chains',
        'assets/Earrings',
        'assets/products/fancy-chains',
        'assets/products/bangles',
        'assets/products/rings',
        'assets/products/studs',
        'assets/products/bracelets',
        'assets/products/chains',
        'assets/products/earrings',
        'assets/products/necklaces',
        'assets/product'
    ]
    
    count = 0
    # 1. Process target directories
    for d in target_dirs:
        if not os.path.exists(d):
            continue
        for ext in ('*.png', '*.jpg', '*.jpeg'):
            for f in glob.glob(os.path.join(d, ext)):
                if upscale_image(f, scale=2):
                    count += 1
                    
    # 2. Process featured homepage product cards (product-01.png to product-08.png)
    for i in range(1, 9):
        f = f'assets/product-0{i}.png'
        if os.path.exists(f):
            if upscale_image(f, scale=2):
                count += 1
                
    print(f"\n==========================================")
    print(f"Successfully upscaled {count} product images!")
    print(f"==========================================")

if __name__ == '__main__':
    main()

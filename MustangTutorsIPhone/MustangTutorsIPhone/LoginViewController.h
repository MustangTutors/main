//
//  LoginViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/3/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LoginViewController : UIViewController <UITextFieldDelegate>
@property (weak, nonatomic) IBOutlet UITextField *smuIdTextField;
@property (weak, nonatomic) IBOutlet UITextField *passwordTextField;
@property (weak, nonatomic) IBOutlet UILabel *welcomeLabel;
@property (weak, nonatomic) IBOutlet UILabel *welcomeValueLabel;
- (BOOL)textFieldShouldReturn:(UITextField *)textField;
-(IBAction)clickedBackground;
@end

//
//  SearchResultTableViewCell.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface SearchResultTableViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *tutorNameLabel;
@property (weak, nonatomic) IBOutlet UILabel *availableLabel;

@property (weak, nonatomic) IBOutlet UILabel *averageRatingLabel;
@property (weak, nonatomic) IBOutlet UIImageView *tutorImageView;

@end

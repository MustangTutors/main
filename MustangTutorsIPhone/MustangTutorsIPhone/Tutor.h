//
//  Tutor.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/13/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <Foundation/Foundation.h>
//public tutor interface
@interface Tutor: NSObject
@property(strong,nonatomic)NSMutableDictionary * tutorInfo;
@property(strong,nonatomic,getter = getFullName)NSString * fullName;
@property(nonatomic,getter = getSmuId)NSInteger smuId;
@property(nonatomic,getter = getUserId)NSInteger userId;
@property(nonatomic,getter = getAverageRating)double averageRating;
@property(nonatomic,getter = isAvailable)BOOL available;
@property(nonatomic,getter = getNumberOfRatings)NSInteger numberOfRatings;
@property(strong,nonatomic,getter = getComments)NSMutableArray * comments;
@property(strong,nonatomic,getter = getHours)NSMutableArray * hours;
@property(strong,nonatomic,getter = getCourses)NSMutableArray * courses;
-(instancetype)initWithDictionary:(NSMutableDictionary *) dict;
-(void)toggleAvailability;
@end
